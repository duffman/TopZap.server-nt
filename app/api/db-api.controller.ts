/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Router }                 from "express";
import { IApiController }         from '@api/api-controller';
import { Logger }                 from '@cli/cli.logger';
import { ProductDb }              from '@db/product-db';
import { IZynSocketServer }          from '@igniter/coldmind/zyn-socket.server';

export class DbApiController implements IApiController {
	debugMode: boolean;
	productDb: ProductDb;

	public attachWSS(wss: IZynSocketServer): void {
	}

	public initRoutes(routes: Router): void {
		this.productDb = new ProductDb();
	}


	/**
	 *
	 * @param {string} barcode
	 * @returns {Promise<SearchResult>}
	 *
	 public getFromDatabase(barcode: string): Promise<SearchResult> {
		return new Promise((resolve, reject) => {
			this.productDb.getProductOffers(reqCode, fullResult, extendedProdData, debugMode).then((result) => {
				if (result.product != null) {
					Logger.logGreen("Product found:", result.product.title);
					res.json(result);
				} else {
					res.json(new Error("Not found"));
				}

			}).catch((error) => {
				Logger.logError("Error in test", error);
			});
		});
	}*/
}
