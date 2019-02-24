/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/*
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
import { BarcodeParser }          from '@zaplib/barcode-parser';
import { IProductData }           from '@zapModels/product.model';
import { IVendorModel }           from '@zapModels/vendor-model';
import { IGameProductData }       from '@zapModels/game-product-model';
import { SessionKeys }            from '@app/types/session-keys';
import { Logger}                  from '@cli/cli.logger';
import { BasketUtils }            from '@components/basket/basket-utils';
import { inspect }                from 'util';

export class BasketHandler {
	constructor() {}

	public getSessionBasket(session: IZynSession): ISessionBasket {
		console.log("Get Session Basket >>>> A:2");
		//let res = session.getAs<ISessionBasket>(SessionKeys.Basket);

		let res = session.get(SessionKeys.Basket) as ISessionBasket;

		if (!res) {
			res = this.ensureBasket(res);
			session.set(SessionKeys.Basket, res);
		}
		console.log("Get Session Basket >>>> A:3", res);
		return res;
	}

	public ensureBasket(sessionBasket: ISessionBasket): ISessionBasket {
		if (!sessionBasket) {
			sessionBasket = new SessionBasket();
			console.log("ensureBasket >> We´re creating the basket ::", sessionBasket.vendorBaskets);
		}

		return sessionBasket;
	}

	public addToBasket(session: IZynSession, offerData: IVendorOfferData): boolean {
		let scope = this;
		console.log("Get Session Basket >>>> A:1");
		let sessBasket = this.getSessionBasket(session);

		Logger.logPurple("## addToBasket");
		BasketUtils.showBasket(sessBasket);

		// We have added to the basket
		Logger.logPurple("## BEGIN::BASKET ## addToBasket ##");
		BasketUtils.showBasket(sessBasket);
		Logger.logPurple("## END:BASKET ##");

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

		return this.addToVendorBasket(session, resultItem);
	}

	public getVendorBasket(sessBasket: ISessionBasket, vendorId: number): IBasketModel {
		let result: IVendorBasket = null;

		console.log("Get getVendorBasket ##### sessBasket.data", sessBasket.vendorBaskets);

		if (!sessBasket.vendorBaskets) {
			console.log("getVendorBasketIT WAS UNASSIGNED!!!!!");
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

	public addToVendorBasket(session: IZynSession, item: IBasketItem): boolean {
		let sessBasket = this.getSessionBasket(session);
		let basket = this.getVendorBasket(sessBasket, item.vendorId);


		Logger.logPurple(":::::::: BASKET BEFORE ADD :::::::::::")
		let cp = session.get(SessionKeys.Basket);
		BasketUtils.showBasket(cp);
		Logger.logPurple(":::::::: ////// BASKET BEFORE ADD :::::::::::")

		let existingItem = basket.items.find(o => o.code === item.code);

		if (typeof existingItem === "object") {
			existingItem.count++;
		} else {
			basket.items.push(item);
		}


		console.log("\n\n");
		//let cp = session.get(SessionKeys.Basket);
		BasketUtils.showBasket(sessBasket);
		console.log(":: INSPECT ::", inspect(sessBasket));
		console.log("\n\n");

		session.set(SessionKeys.Basket, sessBasket);

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

	public getBestBasket(session: IZynSession): IBasketModel {
		let vendorBaskets = this.getSessionBasket(session);
		let bestTotal: number = 0;
		let bestBaset: IBasketModel = null;

		console.log("getBestBasket ::", bestBaset);

		for (let index in vendorBaskets.vendorBaskets) {
			let basket = vendorBaskets.vendorBaskets[index];
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

	public getFullBasket(session: IZynSession): ISessionBasket {
		let sessBasket = this.getSessionBasket(session);
		console.log("getFullBasket :: sessBasket ::", sessBasket);
		return sessBasket;
	}

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

	private calcBasketTotals(sessBasket: ISessionBasket): void {
		if (!sessBasket.vendorBaskets) {
			Logger.logError("calcBasketTotals :: no vendorBaskets");
			return;
		}

		for (let vendorBasket of sessBasket.vendorBaskets) {
			vendorBasket.totalValue = this.getBasketTotal(vendorBasket);
		}
	}

	public getExtSessionBasket(session: IZynSession): Promise<ISessionBasket> {
		let scope = this;
		let sessBasket = this.getFullBasket(session);
		let prodDb = new ProductDb();
		let codes = this.getBasketCodes(sessBasket);

		function getProducts(): Promise<IProductData[]> {
			console.log("getProducts >>>>>");
			return new Promise((resolve, reject) => {
				let codes = scope.getBasketCodes(sessBasket);
				return prodDb.getProducts(codes).then(res => {
					resolve(res);
				}).catch(err => {
					console.log("getExtSessionBasket :: err ::", err);
					reject(err);
				});
			});
		}

		function getVendors(): Promise<IVendorModel[]> {
			console.log("getVendors >>>>>");
			return new Promise((resolve, reject) => {
				return prodDb.getVendors().then(res => {
					resolve(res)
				}).catch(err => {
					console.log("getExtSessionBasket :: err ::", err)
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
				for (let vbasket of sessBasket.vendorBaskets) {
					vbasket.highestBidder = false;
				}

				// Set Highest Bidder Property to the first vendor...
				if (sessBasket.vendorBaskets.length > 0) {
					sessBasket.vendorBaskets[0].highestBidder = true;
					console.log("HIGH BID SET ::", sessBasket.vendorBaskets[0]);
				}

				for (let b of sessBasket.vendorBaskets) {
					console.log("BDATA ::", b);
				}

				// Duffman: 2019-01-05 Breaking Change, attach vendor vendorBaskets to each
				// basket instead of attached directly to the root of the basket
				// sessBasket.vendorData = vendors;

				scope.attachVendors(sessBasket, vendors);
				scope.calcBasketTotals(sessBasket);

			} catch (err) {
				console.log("1 --- getExtSessionBasket :: getSessionBasket ::", err)
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

	public showBasket(session: IZynSession): void {
		let basket = this.getSessionBasket(session);

		for (const vendorData of basket.vendorBaskets) {
			console.log("BASKET :: VENDOR ::", vendorData.vendorId);

			for (const item of vendorData.items) {
				console.log("  ITEM ::", item);
			}
		}
	}

	public removeProductByCode(code: string, basket: ISessionBasket = null): boolean {
		let result = false;

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

	public removeFromVendorBaskets(code: string, basket: ISessionBasket = null): boolean {
		let result = false;

		this.removeProductByCode(code, basket);
		console.log("removeFromVendorBaskets :: removeProductData ::", basket);

		for (const vendorData of basket.vendorBaskets) {
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
*/
