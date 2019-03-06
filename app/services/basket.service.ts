
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { injectable }             from "inversify";
import { IBasketItem }            from '@zapModels/basket/basket-item.model';
import { BasketItem }             from '@zapModels/basket/basket-item.model';
import { IBasketModel }           from '@zapModels/basket/basket.model';
import { IVendorBasket }          from '@zapModels/basket/vendor-basket.model';
import { VendorBasketModel }      from '@zapModels/basket/vendor-basket.model';
import { IVendorOfferData }       from '@zapModels/zap-offer.model';
import { ISessionBasket }         from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import { PRandNum }               from '@putte/prand-num';
import { ProductDb }              from '@db/product-db';
import { IProductData }           from '@zapModels/product.model';
import { IVendorModel }           from '@zapModels/vendor-model';
import { IGameProductData }       from '@zapModels/game-product-model';
import { Logger}                  from '@cli/cli.logger';
import { BasketSessionService }   from '@app/services/basket-session.service';
import { BarcodeParser }          from '@utils/barcode-parser';

export interface IBasketService {
}

@injectable()
export class BasketService implements IBasketService {
	basketSessService: BasketSessionService;

	constructor() {
		this.basketSessService = new BasketSessionService();
	}

	public getSessionBasket(sessId: string): Promise<ISessionBasket> {
		return new Promise((resolve, reject) => {
			this.basketSessService.getSessionBasket(sessId).then(basket => {
				resolve(basket);

			}).catch(err => {
				Logger.logError("getSessionBasket ::", err);
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

		return new Promise((resolve, reject) => {
			this.getSessionBasket(sessId).then(sessionBasket => {
				if (!offerData.accepted) {
					console.log("NOT ACCEPTED");
					return false;
				}

				let vendorOffer = parseFloat(offerData.offer);

				let resultItem = new BasketItem(
					PRandNum.randomNum(),
					1,
					offerData.code,
					offerData.vendorId,
					prepStr(offerData.title),
					vendorOffer
				);

				let result = this.addToVendorBasket(sessionBasket, resultItem);
				this.basketSessService.saveSessionBasket(sessId, sessionBasket);

				resolve(result);

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

	public addToVendorBasket(sessBasket: ISessionBasket, item: IBasketItem): boolean {
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
					bestBasket.vendorData = null;
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
	 * Extract all barcodes from the session basket
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
			console.log("getProdData >>>>>");
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
			console.log("attachProductInfoToItem >>>>>");
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
					console.log("Creating Vendor Array!");
					sessBasket.vendorBaskets = new Array<IVendorBasket>();
				}

				let prodData = await getProducts();
				sessBasket.productData = prodData;
				let vendors = await getVendors();

				console.log("getSessionBasket ::", prodData);

				// Sort the basket according to highest basket value
				sessBasket = scope.sortSessionBasket(sessBasket);

				// HACK TO ATTACH PROD DATA TO IBasketItem decendant IGameBasketItem
				attachProductInfoToItem(sessBasket);

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
