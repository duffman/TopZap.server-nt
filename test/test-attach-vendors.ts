/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {BasketWsApiController} from '@api/ws/basket-ws-api.controller';
import {ISessionBasket, SessionBasket} from '@zapModels/session-basket';
import {GameBasketItem, IGameBasketItem} from '@zapModels/basket/basket-product-item';
import {PRandNum} from '@putte/prand-num';
import {ProductDb} from '@db/product-db';
import {DbManager} from '@putteDb/db-kernel';
import {Logger} from '@cli/cli.logger';
import {BasketHandler} from '@components/basket/basket.handler';
import {BasketItem, IBasketItem} from '@zapModels/basket/basket-item.model';
import {IVendorModel} from '@zapModels/vendor-model';
import {IVendorBasket, VendorBasketModel} from '@zapModels/basket/vendor-basket.model';
import {IGameProductData} from '@zapModels/game-product-model';


let db = new DbManager();
let prodDb = new ProductDb();
let basketWsApiController = new BasketWsApiController(true);

let sessBasket = new SessionBasket();


function getRandomCodes(count: number = 10): Promise<string[]> {
	let sql = `SELECT barcode FROM product_edition ORDER BY RAND() LIMIT ${count}`;
	let result = new Array<string>();

	console.log("SQL ::", sql);

	return new Promise((resolve, reject) => {
		db.dbQuery(sql).then(res => {
			for (let row of res.result.dataRows) {
				console.log("getRandomCodes :: res ::", res);
				result.push(row.getValAsStr("barcode"));
			}
			resolve(result);
		}).catch(err => {
			Logger.logDebugErr("getRandomCodes :: error ::", err);
			reject(err);
		})
	});
}

function getRandomProduct(): Promise<IGameProductData> {
	let sql = `SELECT * FROM product_edition, games WHERE games.id = product_edition.game_id ORDER BY RAND() LIMIT 1`;
	return new Promise((resolve, reject) => {
	});
}


function createProductItem(): Promise<IGameBasketItem> {
	let id = PRandNum.getRandomInt(10, 50);
	let item = new GameBasketItem(id);

	return new Promise((resolve, reject) => {
	});
}

function toBasketItems(games: IGameProductData[]): IBasketItem[] {
	let result = new Array<IBasketItem>();


	/*
	 public zid: string,
	 public code: string = null,
	 public vendorId: number = null,
	 public title: string = null,
	 public offer: number = null,
	 public publisher: string = null,
	 public releaseDate: string = null,
	 public thumbImage: string = null,
	 public count: number =
	*/



	for (let game of games) {
		result.push(
			new BasketItem(
				"2",
				1,
				"CODE",
				-1,
				game.title,
				-1,
				game.publisher,
				game.releaseDate,
				game.thumbImage
			)
		)
	}

	return result;
}

let randomCodes = getRandomCodes().then(res => {
	console.log("RANDOM CODES ::", res);
	return res;
}).then(codes => {
	return prodDb.getProducts(codes).then(products => {
		//console.log(products);


		let productData = toBasketItems(products);
		return productData;

	}).catch(err => {
		console.log("Error getting products")
	});

}).then(data => {

	return prodDb.getVendors().then(vendors => {
		let bh = new BasketHandler();

		//for (let vendor of vendors) {}

		let vendorBasket = new VendorBasketModel(vendors[0].id);
		vendorBasket.items = data as IBasketItem[];

		sessBasket.data.push(vendorBasket);

		bh.attachVendors(sessBasket, vendors);

		return sessBasket;

	}).catch(err => {
		console.log("Error getting products")
	});

}).then((data: ISessionBasket) => {

	console.log("FINAL BASKET ::", data);

	let model = data.data[0] as IVendorBasket;

	console.log("FINAL BASKET :: ITEMS ::", model.items);
	console.log("FINAL BASKET :: VENDOR ::", model.vendorData);


});

