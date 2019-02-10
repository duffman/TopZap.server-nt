/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IBasketItem }            from '@zapModels/basket/basket-item.model';
import { BasketItem }             from '@zapModels/basket/basket-item.model';
import { IBasketModel }           from '@zapModels/basket/basket.model';
import { IVendorBasket }          from '@zapModels/basket/vendor-basket.model';
import { VendorBasketModel }      from '@zapModels/basket/vendor-basket.model';
import { IVendorOfferData }       from '@zapModels/zap-offer.model';
import { ISessionBasket }         from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import { SessionManager }         from '@components/session-manager';
import { PRandNum }               from '@putte/prand-num';
import { ProductDb }              from '@db/product-db';
import { BarcodeParser }          from '@zaplib/barcode-parser';
import { IProductData }           from '@zapModels/product.model';
import { IVendorModel }           from '@zapModels/vendor-model';
import { IGameProductData }       from '@zapModels/game-product-model';

export class BasketHandler {
	constructor(public sessManager: SessionManager) {
	}

	public getSessionBasket(sessId: string): ISessionBasket {
		return this.sessManager.getSessionBasket(sessId);
	}

	public addToBasket(sessId: string, offerData: IVendorOfferData): boolean {
		let scope = this;
		let sessBasket = this.getSessionBasket(sessId);

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
	}

	public addToVendorBasket(sessId: string, item: IBasketItem): boolean {
		let basket = this.getVendorBasket(sessId, item.vendorId);
		let existingItem = basket.items.find(o => o.code === item.code);

		if (typeof existingItem === "object") {
			existingItem.count++;
		} else {
			basket.items.push(item);
		}

		return true;
	}

	public getVendorBasket(sessId: string, vendorId: number): IBasketModel {
		let result: IVendorBasket = null;
		let sessBasket = this.getSessionBasket(sessId);

		for (let i = 0; i < sessBasket.data.length; i++) {
			let basket = sessBasket.data[i];
			if (basket.vendorId === vendorId) {
				result = basket;
				break;
			}
		}

		if (result === null) {
			result = new VendorBasketModel(vendorId);
			sessBasket.data.push(result);
		}

		return result;
	}

	public getBasketTotal(basket: IBasketModel): number {
		let total = 0;

		for (let index in basket.items) {
			let item = basket.items[index];
			total = total + item.offer;
		}

		return total;
	}

	public getBestBasket(sessId: string): IBasketModel {
		let vendorBaskets = this.getSessionBasket(sessId);
		let bestTotal: number = 0;
		let bestBaset: IBasketModel = null;

		console.log("getBestBasket ::", bestBaset);

		for (let index in vendorBaskets.data) {
			let basket = vendorBaskets.data[index];
			let total = this.getBasketTotal(basket);

			if (total > bestTotal) {
				bestTotal = total;
				bestBaset = basket;
			}
		}

		return bestBaset;
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

	public getFullBasket(sessId: string): ISessionBasket {
		let sessBasket = this.getSessionBasket(sessId);
		console.log("getFullBasket :: sessBasket ::", sessBasket);
		return sessBasket;
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
	d
	/**
	 * Get Session Basket with Vendor Data attached to each Vendor Basket
	 * @param {string} sessId
	 * @returns {Promise<ISessionBasket>}
	 */
	public getExtSessionBasket(sessId: string): Promise<ISessionBasket> {
		let scope = this;
		let sessBasket = this.getFullBasket(sessId);
		let prodDb = new ProductDb();
		let codes = this.getBasketCodes(sessBasket);

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
			for (let vb of sessBasket.data) {
				for (let item of vb.items) {
					let prodData: IGameProductData = getProdData(item.code, sessBasket.productData);


					item.thumbImage = prodData.thumbImage;
					item.platformIcon = prodData.platformIcon;
					item.releaseDate = prodData.releaseDate;


					console.log("YAYAYAYAY prodData:::", prodData);
				}
			}
		}

		async function getSessionBasket(): Promise<void> {
			try {
				let prodData = await getProducts();
				sessBasket.productData = prodData;
				let vendors = await getVendors();

				console.log("getSessionBasket ::", prodData);

				// Sort the basket according to highest basket value
				sessBasket = scope.sortSessionBasket(sessBasket);

				// HACK TO ATTACH PROD DATA TO IBasketItem decendant IGameBasketItem
				attachProductInfoToItem(sessBasket);


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
				console.log("getExtSessionBasket :: getSessionBasket ::", err)
			}
		}

		return new Promise((resolve, reject) => {
			getSessionBasket().then(() => {
				resolve(sessBasket);
			});
		});
	}

	public showBasket(sessId: string): void {
		let basket = this.sessManager.getSessionBasket(sessId);

		for (const vendorData of basket.data) {
			console.log("BASKET :: VENDOR ::", vendorData.vendorId);

			for (const item of vendorData.items) {
				console.log("  ITEM ::", item);
			}
		}
	}

	/**
	 * Remove product assicoated with a barcode from a session basket
	 * @param {string} sessId
	 * @param {string} code
	 * @returns {boolean}
	 */
	public removeProductByCode(sessId: string, code: string, basket: ISessionBasket = null): boolean {
		let result = false;

		if (basket === null) {
			basket =this.sessManager.getSessionBasket(sessId);
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

		return result;
	}

	/**
	 * Remove item by barcode from all vendor baskets
	 * @param {string} sessId
	 * @param {string} code
	 * @param {ISessionBasket} basket
	 */
	public removeItemByCode(sessId: string, code: string, basket: ISessionBasket = null): boolean {
		let result = false;

		console.log("removeItemByCode ::", basket);

		if (basket === null) {
			basket = this.getSessionBasket(sessId);
		}

		console.log("removeItemByCode ::", basket);
		this.removeProductByCode(sessId, code, basket);
		console.log("removeItemByCode :: removeProductByCode ::", basket);

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
}