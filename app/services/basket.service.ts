
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { inject, injectable }     from "inversify";
import { IBasketItem }            from '@zapModels/basket/basket-item.model';
import { BasketItem }             from '@zapModels/basket/basket-item.model';
import { IBasketModel }           from '@zapModels/basket/basket.model';
import { IVendorBasket }          from '@zapModels/basket/vendor-basket.model';
import { VendorBasketModel }      from '@zapModels/basket/vendor-basket.model';
import { IVendorOfferData }       from '@zapModels/zap-offer.model';

import { IProdListItem }          from '@zapModels/session-basket';
import { ISessionBasket }         from '@zapModels/session-basket';
import { ProdListItem }           from '@zapModels/session-basket';
import { SessionBasketInfo }      from '@zapModels/session-basket';
import { SessionFlash }           from '@zapModels/session-basket';

import { SessionBasket }          from '@zapModels/session-basket';
import { PRandNum }               from '@putte/prand-num';
import { ProductDb }              from '@db/product-db';
import { IProductData }           from '@zapModels/product.model';
import { IVendorModel }           from '@zapModels/vendor-model';
import { IGameProductData }       from '@zapModels/game-product-model';
import { Logger}                  from '@cli/cli.logger';
import { BasketSessionService }   from '@app/services/basket-session.service';
import { BarcodeParser }          from '@utils/barcode-parser';
import { Interface }              from '@root/kernel.config';
import { LoggingService }         from '@app/services/logging.service';

export interface IBasketService {
}

@injectable()
export class BasketService implements IBasketService {
	basketSessService: BasketSessionService;
	constructor(
		@inject("ILoggingService") private loggingService: LoggingService
	//    @inject(Interface.BasketSessionService) private basketSessService: BasketSessionService
	) {
		//TODO: remove
	     this.basketSessService  = new BasketSessionService();
	}

	public saveBasketSession(sessId: string, session: ISessionBasket): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.basketSessService.saveSessionBasket(sessId, session).then(res => {
				resolve(res);
			}).catch(err => {
				reject(err);
			});
		});
	}

	public getSessionBasket(sessId: string): Promise<ISessionBasket> {
		this.loggingService.logBasket("getSessionBasket :: sessId", sessId);

		return new Promise((resolve, reject) => {
			this.basketSessService.getSessionBasket(sessId).then(basket => {
				this.loggingService.logBasket("getSessionBasket", basket);
				resolve(basket);

			}).catch(err => {
				Logger.logError("getSessionBasket :: err ::", err);
				reject(err);
			});
		});
	}

	public clearFlash(sessId: string): Promise<ISessionBasket> {
		return new Promise((resolve, reject) => {
			this.basketSessService.getSessionBasket(sessId).then(basket => {
				basket.flash = new SessionFlash();
				Logger.logPurple("BasketService :: getSessionBasket ::", sessId);

				return basket;

			}).then(basket => {
				this.basketSessService.saveSessionBasket(sessId, basket).then(res => {
					return basket;
				}).catch (ex => {
					Logger.logError("clearFlash :: saveSessionBasket :: error ::", ex);
					//resolve(basket);
					return basket;
				});

				return basket;

			}).then(basket => {
				resolve(basket);

			}).catch(err => {
				Logger.logError("getSessionBasket :: err ::", err);
				reject(err);
			});
		});

	}

	private ensureBasket(sessionBasket: ISessionBasket): ISessionBasket {
		if (!sessionBasket) {
			sessionBasket = new SessionBasket();
			console.log("ensureBasket :: Creating new SessionBasket");
		}

		return sessionBasket;
	}

	/**
	 * Add new Vendor bid to session basket
	 * @param {string} sessId
	 * @param {IVendorOfferData} offerData
	 * @returns {Promise<boolean>}
	 */
	public addToBasket(sessId: string, offerData: IVendorOfferData): Promise<boolean> {
		function prepStr(data: string): string {
			// data = PStrUtils.replaceEx(data, '"', '\"');
			// data = PStrUtils.replaceEx(data, "'", "\'");
			// return SqlString.escape(data);

			return data;
		}

		console.log("BasketService :: addToBasket :: offerData ::", offerData);

		return new Promise((resolve, reject) => {
			this.getSessionBasket(sessId).then(sessionBasket => {
				console.log("getSessionBasket :: offerData :: type ::", typeof offerData);
				console.log("getSessionBasket :: offerData :: offerData.accepted ::", offerData.accepted);

				let itemTitle = prepStr(offerData.title);

				sessionBasket.flash = new SessionFlash();

				// Tag the session with info for new item data
				sessionBasket.flash.addItemName = itemTitle;

				if (!offerData.accepted) {
					console.log("NOT ACCEPTED");
					sessionBasket.info.itemsRejected++;
					sessionBasket.flash.addItemSuccess = false;
					//return false; // 2019-02-03
				} else {
					sessionBasket.flash.addItemSuccess = true;

					// 2019-04-02
					if (!offerData.offer) {
						offerData.offer = "0";
					}

					let vendorOffer = parseFloat(offerData.offer);

					let resultItem = new BasketItem(
						PRandNum.randomNum(),
						1,
						offerData.code,
						offerData.vendorId,
						itemTitle,
						vendorOffer
					);

					resultItem.accepted = offerData.accepted;
					let result = this.addToVendorBasket(sessionBasket, resultItem);

					//
					// 2019-04-03
					// Add info for the total number of unique products
					sessionBasket.info.itemsAccepted = this.getUniqueCount(sessionBasket);


					//
					// TODO: Figure out what to do is session save fails
					//
					this.basketSessService.saveSessionBasket(sessId, sessionBasket).then(res => {
						Logger.logPurple("saveSessionBasket :: sessId ::", sessId);
					}).catch(err => {
						Logger.logError("saveSessionBasket :: err ::", err);
					});

					resolve(result);
				}

			}).catch(err => {
				Logger.logError("addToBasket ::", err);
				reject()
			});
		});
	}

	/**
	 * Retrieve a specific vendor basket from the session basket
	 * @param {ISessionBasket} sessBasket
	 * @param {number} vendorId
	 * @returns {IBasketModel}
	 */
	public getVendorBasket(sessBasket: ISessionBasket, vendorId: number): IBasketModel {
		let result: IVendorBasket = null;

		console.log("Get getVendorBasket ##### sessBasket.data", sessBasket.vendorBaskets);

		if (!sessBasket.vendorBaskets) {
			console.log("sessBasket.vendorBaskets :: was unassigned");
			sessBasket.vendorBaskets = new Array<IVendorBasket>(); //VendorBasketModel(vendorId);
		}

		for (let i = 0; i < sessBasket.vendorBaskets.length; i++) {
			let basket = sessBasket.vendorBaskets[i];
			if (basket.vendorId === vendorId) {
				result = basket;
				break;
			}
		}

		if (result === null) {
			result = new VendorBasketModel(vendorId);
			sessBasket.vendorBaskets.push(result);
		}

		return result;
	}

	/**
	 * Add item to a separate listing containing all items
	 * @param {ISessionBasket} sessBasket
	 * @param {IBasketItem} item
	 */
	public addToAll(sessBasket: ISessionBasket, item: IBasketItem): void {
		this.loggingService.logBasket("Add to all", item);

		if (!sessBasket.allItems) {
			sessBasket.allItems = new Array<IProdListItem>();
		}

		let itemExists = false; //TODO: Investigate why this is not working // sessBasket.allItems.find(item => item.code === item.code);

		// 2019-04-11, Manual code lookup
		for (let tmpItem of sessBasket.allItems) {
			if (tmpItem.code === item.code) {
				itemExists = true;
				break;
			}
		}

		if (itemExists) {
			this.loggingService.logBasket("Add to all :: Item already exist", sessBasket.allItems);
			return;
		}

		this.loggingService.logBasket("Add to all", item);
		Logger.logPurple("Adding to all ::", item);

		sessBasket.allItems.push(
			new ProdListItem(item.code, item.title)
		);

		Logger.logPurple("Adding to all ::", item);

	}

	public removeFromAll(sessBasket: ISessionBasket, code: string): void {
		Logger.logPurple("removeFromAll ::", code);
		Logger.logPurple("removeFromAll :: BEFORE ::", sessBasket.allItems);

		for (let i = 0; i < sessBasket.allItems.length; i++) {
			let item = sessBasket.allItems[i];

			if (item.code === item.code) {
				Logger.logPurple("ITEM FOUND!!!")
				//sessBasket.allItems = sessBasket.allItems.splice(i, 1);
				sessBasket.allItems.splice(i, 1);
				break;
			}
		}
		//sessBasket.allItems = sessBasket.allItems.splice(0, 1);
		//sessBasket.allItems = sessBasket.allItems.splice(1, 1);

		Logger.logPurple("removeFromAll :: AFTER ::", sessBasket.allItems);

	}

	public addToVendorBasket(sessBasket: ISessionBasket, item: IBasketItem): boolean {
		this.addToAll(sessBasket, item);
		let basket = this.getVendorBasket(sessBasket, item.vendorId);
		let existingItem = basket.items.find(o => o.code === item.code);

		// Here we increase the count if an item already exist
		if (typeof existingItem === "object") {
			existingItem.count++;
		} else {
			basket.items.push(item);
		}

		return true;
	}

	public getBasketTotal(basket: IBasketModel): number {
		let total = 0;

		if (basket.items === null) return 0;

		for (let index in basket.items) {
			let item = basket.items[index];
			total = total + item.offer;
		}

		return total;
	}

	/**
	 * Get the basket with the higest value and attach product data
	 * @param {string} sessId
	 * @returns {Promise<IBasketModel>}
	 */
	public getCurrentBasket(sessId: string): Promise<ISessionBasket> {
		console.log("getCurrentBasket -->");
		let scope = this;
		let result: ISessionBasket = null;
		let error: any = null;

		async function getBasket(): Promise<void> {
			try {
				let sessionBasket: ISessionBasket = await scope.getReviewData(sessId);
				let baskets = sessionBasket.vendorBaskets;

				// Remove all baskets except the first (highest value)
				if (baskets && baskets.length > 0) {
					let bestBasket = baskets[0];

					// 2019-04-02 Change to include vendor
					// info in the best basket
					// BEFORE CHANGE: bestBasket.vendorData = null;

					baskets = [bestBasket];
				}

				result = sessionBasket;

			} catch (ex) {
				error = ex;
			}
		}

		return new Promise((resolve, reject) => {
			getBasket().then(() => {
				if (error !== null) {
					reject(error);
				} else {
					resolve(result);
				}

			}).catch(err => {
				Logger.logError("getCurrentBasket :: err ::", err);
			});
		});
	}

	/**
	 * Returns the vendor basket with the highest value
	 * @param {ISessionBasket} sessionBasket
	 * @returns {IBasketModel}
	 */
	public getBestBasket(sessionBasket: ISessionBasket): IBasketModel {
		let vendorBaskets = sessionBasket.vendorBaskets;
		let bestTotal: number = 0;
		let bestBaset: IBasketModel = null;

		console.log("getBestBasket ::", bestBaset);

		for (let index in vendorBaskets) {
			let basket = vendorBaskets[index];
			let total = this.getBasketTotal(basket);

			if (total > bestTotal) {
				bestTotal = total;
				bestBaset = basket;
			}
		}

		return bestBaset;
	}

	/**
	 * TODO: IMPLEMENT REAL FUNCTIONALITY
	 * @param {ISessionBasket} sessionBasket
	 * @returns {Promise<ISessionBasket>}
	 */
	public extendSessionBasket(sessionBasket: ISessionBasket): Promise<ISessionBasket> {
		let prodDb = new ProductDb();

		return new Promise((resolve, reject) => {
			prodDb.getProducts(['0819338020068', '0887195000424']).then(res => {

			}).catch(err => {
				console.log("extendSessionBasket :: err ::", err);
			});
		});
	}

	/**
	 * Get a list of unique barcodes from the session basket
	 * @param {ISessionBasket} sessionBasket
	 * @returns {string[]}
	 */
	public getBasketCodes(sessionBasket: ISessionBasket): string[] {
		let result = new Array<string>();

		if (!sessionBasket) {
			return result;
		}

		function addBarcode(code: string): void {
			code = BarcodeParser.prepEan13Code(code);

			if (result.indexOf(code) === -1) {
				result.push(code);
			}
		}

		for (const vendorBasket of sessionBasket.vendorBaskets) {
			for (const item of vendorBasket.items) {
				addBarcode(item.code);
			}
		}

		return result;
	}

	/**
	 * Get the total number of unique products
 	 * @param {ISessionBasket} sessionBasket
	 * @returns {number}
	 */
	public getUniqueCount(sessionBasket: ISessionBasket): number {
		let list = this.getBasketCodes(sessionBasket);
		return (list) ? list.length : 0;
	}

	/**
	 * Returns all Vendor baskets
	 * @param {string} sessId
	 * @returns {Promise<ISessionBasket>}
	 */
	public getFullBasket(sessId: string): Promise<ISessionBasket> {
		return new Promise((resolve, reject) => {
			return this.basketSessService.getSessionBasket(sessId).then(sessionBasket => {
				resolve(sessionBasket);
			}).catch(err => {
				Logger.logError("getFullBasket ::", err);
				reject(err);
			});
		});
	}

	/**
	 * Order baskets by total value
	 * @param {ISessionBasket} sessionBasket
	 * @returns {ISessionBasket}
	 */
	public sortSessionBasket(sessionBasket: ISessionBasket): ISessionBasket {
		this.ensureBasket(sessionBasket);

		for (const basket of sessionBasket.vendorBaskets) {
			basket.totalValue = this.getBasketTotal(basket);
		}

		sessionBasket.vendorBaskets = sessionBasket.vendorBaskets.sort((x, y) => {
			if (x.totalValue > y.totalValue) {
				return -1;
			}
			if (x.totalValue < y.totalValue) {
				return 1;
			}
			return 0;
		});

		return sessionBasket;
	}

	/**
	 * Attach Vendor Data
	 * Attaches vendor info to basket items
	 * @param {ISessionBasket} sessBasket
	 * @param {IVendorModel[]} vendors
	 */
	public attachVendors(sessBasket: ISessionBasket, vendors: IVendorModel[]): void {
		function getVendorDataById(vendorId: number): IVendorModel {
			let result: IVendorModel = null;
			for (let vendorData of vendors) {
				if (vendorData.id === vendorId) {
					result = vendorData;
					break;
				}
			}

			return result;
		}

		for (let vendorBasket of sessBasket.vendorBaskets) {
			let vendorData = getVendorDataById(vendorBasket.vendorId);
			vendorBasket.vendorData = vendorData;

			//console.log("Attached vendor data ::", vendorBasket.vendorData);
		}
	}

	/**
	 * Calculate total value of each basket
	 * @param {ISessionBasket} sessBasket
	 */
	private calcBasketTotals(sessBasket: ISessionBasket): void {
		if (!sessBasket.vendorBaskets) {
			Logger.logError("calcBasketTotals :: no vendorBaskets");
			return;
		}

		for (let vendorBasket of sessBasket.vendorBaskets) {
			vendorBasket.totalValue = this.getBasketTotal(vendorBasket);
		}
	}

	/**
	 * Get all baskets for all vendors including product data
	 * @param {string} sessId
	 * @returns {Promise<ISessionBasket>}
	 */
	public getReviewData(sessId: string): Promise<ISessionBasket> {
		let scope = this;
		let sessBasket: ISessionBasket;
		let prodDb = new ProductDb();

		function getProducts(): Promise<IProductData[]> {
			return new Promise((resolve, reject) => {
				let codes = scope.getBasketCodes(sessBasket);
				return prodDb.getProducts(codes).then(res => {
					resolve(res);
				}).catch(err => {
					Logger.logError("getExtSessionBasket :: err ::", err);
					reject(err);
				});
			});
		}

		function getVendors(): Promise<IVendorModel[]> {
			return new Promise((resolve, reject) => {
				return prodDb.getVendors().then(res => {
					resolve(res)
				}).catch(err => {
					Logger.logError("getExtSessionBasket :: err ::", err)
				});
			});
		}

		function getProdData(code: string, prodData: IProductData[]): IProductData {
			let res: IProductData = null;
			for (let prod of prodData) {
				if (prod.code === code) {
					res = prod;
					break;
				}
			}
			return res;
		}

		function attachProductInfoToItem(sessBasket: ISessionBasket): void {
			scope.ensureBasket(sessBasket);

			for (let vb of sessBasket.vendorBaskets) {
				for (let item of vb.items) {
					let prodData: IGameProductData = getProdData(item.code, sessBasket.productData);

					item.thumbImage = prodData.thumbImage;
					item.platformIcon = prodData.platformIcon;
					item.releaseDate = prodData.releaseDate;
				}
			}
		}

		async function getSessionBasket(): Promise<void> {
			try {
				sessBasket = await scope.getFullBasket(sessId);

				if (!sessBasket.vendorBaskets) {
					Logger.logDebug("Creating Vendor Array!");
					sessBasket.vendorBaskets = new Array<IVendorBasket>();
				}

				let prodData = await getProducts();
				sessBasket.productData = prodData;
				let vendors = await getVendors();

				// Sort the basket according to highest basket value
				sessBasket = scope.sortSessionBasket(sessBasket);

				Logger.logDebug("SESSION BASKET ¤¤¤¤¤¤ ::", sessBasket);

				/*
				function findEmptyBasket(): boolean {
					let res = false;

					let index = 0;
					for (index = 0; index < sessBasket.vendorBaskets.length; index++) {
						if (sessBasket.vendorBaskets[index].items.length < 1) {
							sessBasket.vendorBaskets = sessBasket.vendorBaskets.splice(index, 1);
							res = true;
							break;
						}
					}

					return res;
				}

				while (true) {
					console.log("Removing Empty basket");
					let emptyFound = findEmptyBasket();
					if (!emptyFound) break;
				}
				*/


//				for (let index = sessBasket.vendorBaskets.length; index > 0; index--) {

				/*
				for (let i = 0; i < sessBasket.vendorBaskets.length; i++) {
					if (sessBasket.vendorBaskets[i].items.length < 1) {
						console.log("EMPTY BASKET :::", sessBasket.vendorBaskets[i]);
//						sessBasket.vendorBaskets = sessBasket.vendorBaskets.splice(index, 1);
					}
				}
				*/
				/*
				for (let index = sessBasket.vendorBaskets.length; index > 0; index--) {
					console.log("AAAAA :::", sessBasket.vendorBaskets[index]);

					if (sessBasket.vendorBaskets[index].items.length < 1) {
						sessBasket.vendorBaskets = sessBasket.vendorBaskets.splice(index, 1);
					}
				}
				*/


				// HACK TO ATTACH PROD DATA TO IBasketItem decendant IGameBasketItem
				attachProductInfoToItem(sessBasket);
				Logger.logGreen("Products in Session Basket ::", sessBasket);

				//Hack
				for (let vbasket of sessBasket.vendorBaskets) {
					vbasket.highestBidder = false;
				}

				// Set Highest Bidder Property to the first vendor...
				if (sessBasket.vendorBaskets.length > 0) {
					sessBasket.vendorBaskets[0].highestBidder = true;
				}

				// Duffman: 2019-01-05 Breaking Change, attach vendor data to each
				// basket instead of attached directly to the root of the basket
				// sessBasket.vendorData = vendors;

				scope.attachVendors(sessBasket, vendors);
				scope.calcBasketTotals(sessBasket);

			} catch (err) {
				console.log("2 --- getExtSessionBasket :: getSessionBasket ::", err)
			}
		}

		return new Promise((resolve, reject) => {
			getSessionBasket().then(() => {
				resolve(sessBasket);
			}).catch(err => {
				Logger.logFatalError("getExtSessionBasket");
				reject(err);

			});
		});
	}

	public showBasket(sessId: string): void {
		this.getFullBasket(sessId).then(sessionBasket => {
			for (const vendorData of sessionBasket.vendorBaskets) {
				console.log("BASKET :: VENDOR ::", vendorData.vendorId);

				for (const item of vendorData.items) {
					console.log("  ITEM ::", item);
				}
			}

		}).catch(err => {
			Logger.logError("showBasket ::", err);
		});
	}

	/**
	 * Remove product assicoated with a barcode from a session basket
	 * @param {string} sessId
	 * @param {string} code
	 * @returns {boolean}
	 */
	private removeProductData(code: string, basket: ISessionBasket): Promise<boolean> {
		let result = false;

		return new Promise((resolve, reject) => {
			try {
				basket.productData = !(basket.productData) ? new Array<IProductData>() : basket.productData;

				for (let i = 0; i < basket.productData.length; i++) {
					let product = basket.productData[i];
					if (product.code === code) {
						console.log(">>> FOUND PROD TO REMOVE ::", code);
						basket.productData.splice(i, 1);
						result = true;
						break;
					}
				}

				// 2019-04-14 Remove from all
				this.removeFromAll(basket, code);

				resolve(result);

			} catch (ex) {
				reject(ex);
			}
		});

	}

	/**
	 * Remove item by barcode from all vendor baskets
	 * @param {string} sessId
	 * @param {string} code
	 * @param {ISessionBasket} basket
	 */
	private removeFromVendorBaskets(code: string, basket: ISessionBasket = null): Promise<boolean> {
		let result = false;

		return new Promise((resolve, reject) => {
			console.log("removeFromVendorBaskets :: removeProductData");

			try {
				for (const vendorData of basket.vendorBaskets) {
					console.log("VENDOR BASKET ::", vendorData.vendorId);

					for (let i = 0; i < vendorData.items.length; i++) {
						let item = vendorData.items[i];
						if (item.code === code) {
							console.log(">>> FOUND ITEM TO REMOVE ::", code);
							vendorData.items.splice(i, 1);
							result = true;
							break;
						}
					}
				}

				resolve(result);

			} catch (ex) {
				reject(ex);
			}
		});
	}

	public removeItem(code: string, sessId: string): Promise<boolean> {
		let scope = this;

		console.log("***************************");
		console.log("* REMOVE ITEM :: CODE ::", code);
		console.log("* REMOVE ITEM :: SESSID ::", sessId);
		console.log("***************************");

		return new Promise((resolve, reject) => {
			this.getSessionBasket(sessId).then(sessionBasket => {
				// First Remove unnecessary product data
				let remRes = this.removeFromVendorBaskets(code, sessionBasket);
				console.log("Rmmoved From Vendor Baskets ::", remRes);

				// Remove from all items
				this.removeFromAll(sessionBasket, code);

				return sessionBasket;

			}).then(sessionBasket => {
				let remRes = this.removeProductData(code, sessionBasket);
				console.log("Rmmoved From Product Data ::", remRes);

				return sessionBasket;
			}).then(sessionBasket => {
				this.basketSessService.saveSessionBasket(sessId, sessionBasket);
				resolve(true);

			}).catch(err => {
				Logger.logError("BasketService :: removeItem :: err ::", err)
				reject(err);
			});
		});
	}
}
