/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Express, Router }        from "express";
import { Request, Response }      from "express";
import { IRestApiController }     from "@api/api-controller";
import { ProductDb }              from "@db/product-db";
import { Logger }                 from "@cli/cli.logger";
import { ZapErrorResult }         from '@zapModels/zap-error-result';
import { IProductData }           from '@zapModels/product.model';
import { ProductDataResult }      from '@zapModels/product-data-result';
import { IProductsController }    from '@app/components/product/products.controller';
import { ProductsController }     from '@app/components/product/products.controller';

export class ProductApiController implements IRestApiController {
	controller: IProductsController;
	productDb: ProductDb;

	constructor(public debugMode: boolean = false) {
		this.controller = new ProductsController();
		this.productDb = new ProductDb();
	}

	public getProduct(barcode: string): Promise<IProductData> {
		return new Promise((resolve, reject) => {
			this.productDb.getGameData(barcode).then((res) => {
				resolve(res);
				console.log("%%%%% ::: getGameData ::", res);
			}).catch((err) => {
				Logger.logError("ProductApiController :: getGameData :: error ::", err);
				reject(err);
			});
		});
	}

	public initRoutes(routes: Router) {
		let scope = this;

		routes.get("/kalle/:code", (req: Request, resp: Response) => {
			console.log(":: KALLE ::");
			resp.json({kalle: "kula"});
		});

		routes.post("/prod/:code", (req: Request, resp: Response) => {
			let code = req.params.code;
		});

		//
		// Get product info
		//
		routes.post("/prod", (req: Request, resp: Response) => {
			let code = req.body.code;

			console.log("CODE :: ", code);
			let productResult = new ProductDataResult();

			scope.getProduct(code).then((productData) => {
				productResult.success = true;
				productResult.productData = productData;

				//Logger.log("routes.post/prod :: ProductApiController :: getGameData ::", productData);
				//console.log("routes.post/prod :: JSON.stringify :: getGameData ::", JSON.stringify(productData))

				resp.json(productResult);

			}).catch((err) => {
				Logger.logError("ProductApiController :: error ::", err);
				let zapError = new ZapErrorResult(6667, "error-getting-item");

				productResult.success = false;
				productResult.error = zapError;

				resp.json(productResult);
			});
		});

		routes.get("/prod/:code", (req: Request, resp: Response) => {
			let code = req.params.code;

			console.log("CODE :: ", code);

			scope.getProduct(code).then((prodResult) => {
				Logger.log("ProductApiController :: getGameData ::", prodResult);

				console.log("KKKKK ::", JSON.stringify(prodResult))

				resp.json(prodResult);

			}).catch((err) => {
				Logger.logError("ProductApiController :: error ::", err);
				resp.json({
						result: "fail",
						errorCode: 6667
					});
			});
		});

		//
		// Product Bid
		//
		routes.post("/calcbasket/:barcode", (req, res) => {
			let fruits = req.body.items.split(",");
			console.log(fruits); // This is an array
		});
	}
}
