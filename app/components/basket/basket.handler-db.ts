/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {IBasketItem} from '@zapModels/basket/basket-item.model';
import {BasketItem} from '@zapModels/basket/basket-item.model';
import {IBasketModel} from '@zapModels/basket/basket.model';
import {IVendorBasket} from '@zapModels/basket/vendor-basket.model';
import {VendorBasketModel} from '@zapModels/basket/vendor-basket.model';
import {IVendorOfferData} from '@zapModels/zap-offer.model';
import {ISessionBasket} from '@zapModels/session-basket';
import {PRandNum} from '@putte/prand-num';
import {ProductDb} from '@db/product-db';
import {BarcodeParser} from '@zaplib/barcode-parser';
import {IVendorModel} from '@zapModels/vendor-model';
import {IGameProductData} from '@zapModels/game-product-model';
import { IProductData} from '@zapModels/product.model';
import { IGameBasketItem} from '@zapModels/basket/basket-product-item';
import { ProductItemTypes} from '@zapModels/product-item-types';
import { CliDebugYield} from '@cli/cli.debug-yield';
import { Logger} from '@cli/cli.logger';
import { AppSessionManager} from '@components/app-session-manager';

export class BasketHandlerDb {
	constructor(public sessManager: AppSessionManager) {
	}

	public getSessionBasket(sessId: string): Promise<ISessionBasket> {
		return this.sessManager.getSessionBasket(sessId);
	}

	public addToBasket(sessId: string, offerData: IVendorOfferData): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.getSessionBasket(sessId).then(sessBasket => {

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
					offerData.title,
					vendorOffer
				);

				return this.addToVendorBasket(sessId, resultItem);


			}).catch(err => {
				Logger.logAppError(this, "addToBasket", err);
				reject(err);
			})
		});
	}

	/**
	 * Add a prepared BasketItem to the session
	 * @param {string} sessId
	 * @param {IBasketItem} item
	 * @returns {Promise<boolean>}
	 */
	public addToVendorBasket(sessId: string, item: IBasketItem): Promise<boolean> {
		//return this.getVendorBasket(sessId, item.vendorId).then(basket => {

		return new Promise((resolve, reject) => {
			return this.getSessionBasket(sessId).then(sessBasket => {

				for (let vendorBasket of sessBasket.data) {
					let existingItem = vendorBasket.items.find(o => o.code === item.code);

					if (typeof existingItem === "object") {
						existingItem.count++;
					} else {
						vendorBasket.items.push(item);
					}
				}

				return this.sessManager.setSessionBasket(sessId, sessBasket);
			});
		});
	}

	/**
	 * Find vendor basket in given SessionBasket
	 * @param {number} vendorId
	 * @param {ISessionBasket} sessionBasket
	 * @returns {IVendorBasket}
	 */
	public findVendorBasketInSession(vendorId: number, sessionBasket: ISessionBasket): IVendorBasket {
		let result: IVendorBasket = null;

		for (let i = 0; i < sessionBasket.data.length; i++) {
			let basket = sessionBasket.data[i];
			if (basket.vendorId === vendorId) {
				result = basket;
				break;
			}
		}

		return result;
	}

	public findItemByCodeInVendorBasket(code: string, vendorBasket: IVendorBasket): IBasketItem {
		let result: IBasketItem = null;

		for (let i = 0; i < vendorBasket.items.length; i++) {
			let item = vendorBasket.items[i];
			if (item.code === code) {
				result = item;
				break;
			}
		}

		return result;
	}

	public getVendorBasket(sessId: string, vendorId: number): Promise<IVendorBasket> {
		let result: IVendorBasket = null;

		return new Promise((resolve, reject) => {
			return this.getSessionBasket(sessId).then(sessBasket => {
				let basket = this.findVendorBasketInSession(vendorId, sessBasket);
				resolve(basket);
			}).catch(err => {
				Logger.logAppError(this, "getVendorBasket", err);
				reject(err);
			});
		});

	}

	public getBasketTotal(basket: IBasketModel): number {
		let total = 0;

		for (let index in basket.items) {
			let item = basket.items[index];
			total = total + item.offer;
		}

		return total;
	}

	public getBestBasket(sessId: string): Promise<IBasketModel> {
		let bestTotal: number = 0;
		let bestBaset: IBasketModel = null;

		return new Promise((resolve, reject) => {
			return this.getSessionBasket(sessId).then(sessBasket => {
				console.log("getBestBasket ::", bestBaset);

				for (let index in sessBasket.data) {
					let basket = sessBasket.data[index];
					let total = this.getBasketTotal(basket);

					if (total > bestTotal) {
						bestTotal = total;
						bestBaset = basket;
					}
				}

				resolve(bestBaset);

			}).catch(err => {
				Logger.logAppError(this, "getBestBasket", err);
				reject(err);
			});
		});
	}

	public extendSessionBasket(data: ISessionBasket): Promise<ISessionBasket> {
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

		function addBarcode(code: string): void {
			code = BarcodeParser.prepEan13Code(code);

			if (result.indexOf(code) === -1) {
				result.push(code);
			}
		}

		for (const vendorBasket of sessionBasket.data) {
			for (const item of vendorBasket.items) {
				addBarcode(item.code);
			}
		}

		return result;
	}

	public getFullBasket(sessId: string): Promise<ISessionBasket> {
		return new Promise((resolve, reject) => {
			return this.getSessionBasket(sessId).then(sessBasket => {
				console.log("getFullBasket :: sessBasket ::", sessBasket);
				resolve(sessBasket);

			}).catch(err => {
				Logger.logAppError(this, "getFullBasket", err);
				reject(err);
			});
		});
	}

	public sortSessionBasket(sessionBasket: ISessionBasket): ISessionBasket {
		for (const basket of sessionBasket.data) {
			basket.totalValue = this.getBasketTotal(basket);
		}

		sessionBasket.data = sessionBasket.data.sort((x, y) => {
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
	 * Attaches
	 * @param {ISessionBasket} sessBasket
	 * @param {IVendorModel[]} vendors
	 */
	public attachVendors(sessBasket: ISessionBasket, vendors: IVendorModel[]): void {
		console.log("attachVendors ::", sessBasket);

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

		for (let vendorBasket of sessBasket.data) {
			console.log("attachVendors :: LOOPING :: vendorBasket ::", vendorBasket);

			let vendorData = getVendorDataById(vendorBasket.vendorId);
			vendorBasket.vendorData = vendorData;
		}
	}

	/**
	 * Calculate total value of each basket
	 * @param {ISessionBasket} sessBasket
	 */
	private calcBasketTotals(sessBasket: ISessionBasket): void {
		for (let vendorBasket of sessBasket.data) {
			vendorBasket.totalValue = this.getBasketTotal(vendorBasket);
		}
	}

	private generateZid(): string {
		let zid = PRandNum.getRandomInt(10, 22000).toFixed(2);
		return zid;
	}


	/**
	 * Get Session Basket with Vendor Data attached to each Vendor Basket
	 * @param {string} sessId
	 * @returns {Promise<ISessionBasket>}
	 */
	public getExtSessionBasket(sessId: string): Promise<ISessionBasket> {
		Logger.logGreen("****** getExtSessionBasket")
		let scope = this;
		let sessBasket: ISessionBasket = null;
		let prodDb = new ProductDb();

		function getFullBasket(): Promise<ISessionBasket> {
			return new Promise((resolve, reject) => {
				return this.getFullBasket(sessId);
			});
		}

		function getProducts(): Promise<IProductData[]> {
			return new Promise((resolve, reject) => {
				let codes = scope.getBasketCodes(sessBasket);
				return prodDb.getProducts(codes).then(res => {
					console.log("FETRES :::", res);
					resolve(res);
				}).catch(err => {
					console.log("getExtSessionBasket :: err ::", err);
					reject(err);
				});
			});
		}

		function getVendors(): Promise<IVendorModel[]> {
			return new Promise((resolve, reject) => {
				return prodDb.getVendors().then(res => {
					resolve(res)
				}).catch(err => {
					console.log("getExtSessionBasket :: err ::", err)
				});
			});
		}

		/**
		 * Retrieves productdata with a given barcode from given productdata array
		 * @param {string} code
		 * @param {IGameProductData[]} prodData
		 * @returns {IGameProductData}
		 */
		function getCoreProductData(code: string, prodData: IProductData[]): IProductData {
			let res: IProductData = null;
			for (let prod of prodData) {
				if (prod.code === code) {
					res = prod;
					break;
				}
			}
			return res;
		}

		/**
		 * Retrieves gamedata with a given barcode from given gamedata array
		 * @param {string} code
		 * @param {IGameProductData[]} prodData
		 * @returns {IGameProductData}
		 */
		function getGameProductData(code: string, prodData: IGameProductData[]): IGameProductData {
			let res: IGameProductData = null;
			for (let prod of prodData) {
				if (prod.code === code) {
					res = prod;
					break;
				}
			}
			return res;
		}

		function getProductData(code: string, prodType: ProductItemTypes, sessBasket: ISessionBasket): any {
			let result: any[];

			switch (prodType) {
				case ProductItemTypes.GAME: {
					getGameProductData(code, sessBasket.productData);
				}
			}

			return result;
		}

		function attachProductInfoToItem(sessBasket: ISessionBasket): void {

			Logger.logGreen("--------------------------------");
			Logger.logGreen("sessBasket ::", sessBasket);
			Logger.logGreen("--------------------------------");

			for (let vb of sessBasket.data) {
				for (let vbItem of vb.items) {
					let gameBasketItem: IGameBasketItem = vbItem as IGameBasketItem;

					//TODO: Find a more sane way of making the distinction between types
					//let prodData: IGameProductData = getProductData(gameBasketItem.code,ProductItemTypes.GAME, sessBasket) as IGameProductData;


					let prodData = getGameProductData(gameBasketItem.code, sessBasket.productData);




					/* IProductData
						public id:            number = -1,
						public code:          string = '',
						public platformName:  string = '',
						public title:         string = '',
						public publisher:     string = '',
						public developer:     string = '',
						public genre:         string = '',
						public coverImage:    string = '',
						public thumbImage:    string = '',
						public videoSource:   string = '',
						public source:        string = '',
						public releaseDate:   string = '',
						public platformIcon:  string = '',
						public platformImage: string = '',
					 */

					gameBasketItem.zid = scope.generateZid();
					gameBasketItem.code = prodData.code;
					gameBasketItem.id = prodData.id;
					gameBasketItem.itemType = ProductItemTypes.GAME;
					gameBasketItem.vendorId = vbItem.vendorId;
					gameBasketItem.title = prodData.title;
					gameBasketItem.offer = vbItem.offer;
					gameBasketItem.thumbImage = prodData.thumbImage;
					gameBasketItem.platformIcon = prodData.platformIcon;
					gameBasketItem.count = vbItem.count;
					gameBasketItem.platformName = prodData.platformName;
					gameBasketItem.publisher = prodData.publisher;
					gameBasketItem.releaseDate = prodData.releaseDate;
				}
			}
		}

		async function getSessionBasket(): Promise<void> {
			try {
				sessBasket = await getFullBasket();
				let prodDb = new ProductDb();
				let codes = this.getBasketCodes(sessBasket);

				let prodData = await getProducts();
				sessBasket.productData = prodData;
				let vendors = await getVendors();

				console.log("getSessionBasket ::", prodData);

				// Sort the basket according to highest basket value
				sessBasket = scope.sortSessionBasket(sessBasket);

				console.log("getSessionBasket :: SORTED ::", sessBasket);


				// HACK TO ATTACH PROD DATA TO IBasketItem decendant IGameBasketItem
				attachProductInfoToItem(sessBasket);

				console.log("getSessionBasket :: ATTACHED ::", sessBasket);


				//Hack
				for (let vbasket of sessBasket.data) {
					vbasket.highestBidder = false;
				}

				// Set Highest Bidder Property to the first vendor...
				if (sessBasket.data.length > 0) {
					sessBasket.data[0].highestBidder = true;
					console.log("HIGH BID SET ::", sessBasket.data[0]);
				}

				for (let b of sessBasket.data) {
					console.log("BDATA ::", b);
				}

				// Duffman: 2019-01-05 Breaking Change, attach vendor data to each
				// basket instead of attached directly to the root of the basket
				// sessBasket.vendorData = vendors;

				scope.attachVendors(sessBasket, vendors);
				scope.calcBasketTotals(sessBasket);

			} catch (err) {
				let errMessage = "getExtSessionBasket :: ERROR ::";
				Logger.logError(errMessage, err);
				CliDebugYield.fatalError(errMessage, err, true);
			}
		}

		return new Promise((resolve, reject) => {
			getSessionBasket().then(() => {
				resolve(sessBasket);
			});
		});
	}

	public showBasket(sessId: string): void {
		this.sessManager.getSessionBasket(sessId).then(basket => {
			for (const vendorData of basket.data) {
				//console.log("BASKET :: VENDOR ::", vendorData.vendorId);

				for (const item of vendorData.items) {
					console.log("  ITEM ::", item.title + " " + item.offer);
				}
			}
		}).catch(err => {
			Logger.logAppError(this, "showBasket", err);
		});
	}

	/**
	 * Remove product assicoated with a barcode from a session basket
	 * @param {string} sessId
	 * @param {string} code
	 * @returns {boolean}
	 */
	public removeProductByCode(sessId: string, code: string, basket: ISessionBasket = null): Promise<boolean> {
		let result = false;

		async function excecute(): Promise<void> {
			if (basket === null) {
				basket = await this.sessManager.getSessionBasket(sessId);
			}

			basket.productData = !(basket.productData) ? new Array<IProductData>() : basket.productData;

			for (let i = 0; i < basket.productData.length; i++) {
				let product = basket.productData[i];
				if (product.code === code) {
					basket.productData.splice(i, 1);
					result = true;
					break;
				}
			}
		}

		return new Promise((resolve, reject) => {
			excecute().then(() => {
				resolve(result);
			})
		});
	}

	private removeItemFromBasket(code: string, basket: ISessionBasket): boolean {
		// TODO: snygga till detta bara för sakens skull.. detta var inte så jävla skitsnyggt
		let result = false;
		if (basket === null) {
			return result;
		}

		for (const vendorData of basket.data) {
			console.log("VENDOR BASKET ::", vendorData);

			for (let i = 0; i < vendorData.items.length; i++) {
				let item = vendorData.items[i];
				if (item.code === code) {
					vendorData.items.splice(i, 1);
					result = true;
					break;
				}
			}
		}

		return result;
	}

	/**
	 * Remove item by barcode from all vendor baskets
	 * @param {string} sessId
	 * @param {string} code
	 * @param {ISessionBasket} basket
	 */
	public removeItemByCode(sessId: string, code: string, basket: ISessionBasket = null): Promise<boolean> {
		let result = false;


		console.log("removeItemByCode ::", basket);


		return new Promise((resolve, reject) => {
			if (basket === null) {
				return this.sessManager.getSessionBasket(sessId).then(sessBasket => {
					this.removeItemFromBasket(code, sessBasket);

					return this.sessManager.setSessionBasket(sessId, sessBasket).then(res => {
						resolve(res);

					}).catch(err => {
						Logger.logAppError(this,"removeItemByCode", err);
						reject(err);
					});

				}).catch(err => {
					Logger.logAppError(this, "getSessionBasket :: ERROR ::", err);
					reject(err);
				});

			} else {
				this.removeItemFromBasket(code, basket);

				return this.sessManager.setSessionBasket(sessId, basket).then(res => {
					resolve(res);

				}).catch(err => {
					Logger.logAppError(this,"removeItemByCode", err);
					reject(err);
				});

			}


		});


		/*
				if (basket === null) {
				basket = this.sessManager.getSessionBasket(sessId);
			}

			console.log("removeItemByCode ::", basket);
			this.removeProductByCode(sessId, code, basket);
			console.log("removeItemByCode :: removeProductByCode ::", basket);
			*/


	}
}
