/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { DbManager }              from "@putteDb/db-kernel";
import { SQLTableDataRow }        from "@putteDb/sql-table-data-row";
import { Logger }                 from "@cli/cli.logger";
import { IVendorModel }           from "@zapModels/vendor-model";
import { Vendor }                 from "@zapModels/vendor-model";
import { PlatformTypeParser }     from "@utils/platform-type-parser"
import { PStrUtils }              from "@putte/pstr-utils";
import { CliCommander }           from "@cli/cli.commander";
import { IProductData }           from '@zapModels/product.model';
import { ProductData }            from '@zapModels/product.model';
import {GameProductData, IGameProductData} from '@zapModels/game-product-model';

export class ProductDb {
	db: DbManager;

	constructor() {
		this.db = new DbManager();
		this.init();
	}

	private init() {}

	//
	// Get Product
	// - extended adds pltform image info
	//
	public getGameData(barcode: string, extended: boolean = true, debug: boolean = false): Promise<IGameProductData> {
		function generateSql(): string {
			if (!debug) {
				return `SELECT games.* FROM games, product_edition AS edition WHERE edition.barcode='${barcode}' AND games.id = edition.game_id`;
			} else {
				return `SELECT games.* FROM games, product_edition AS edition WHERE games.id = edition.game_id ORDER BY RAND() LIMIT 1`;
			}
		}

		let sql = generateSql();

		Logger.logGreen("SQL ::", sql);

		function createGameProductModel(dbRow: SQLTableDataRow): IGameProductData {
			if (dbRow.isEmpty) {
				return new ProductData();
			} else {
				return new GameProductData(
					dbRow.getValAsInt("id"),
					barcode,
					dbRow.getValAsStr("platform_name"),
					dbRow.getValAsStr("title"),
					dbRow.getValAsStr("publisher"),
					dbRow.getValAsStr("developer"),
					dbRow.getValAsStr("genre"),
					dbRow.getValAsStr("cover_image"),
					dbRow.getValAsStr("thumb_image"),
					dbRow.getValAsStr("video_source"),
					dbRow.getValAsStr("source"),
					dbRow.getValAsStr("release_date")
				);
			}
		}

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				let dbRow = dbRes.safeGetFirstRow();

				let model: IGameProductData = createGameProductModel(dbRow);
				let havePlatformAndTitle = !PStrUtils.isEmpty(model.platformName) && !PStrUtils.isEmpty(model.title);

				//
				// Add extended properties
				//
				if (extended && !dbRow.isEmpty && havePlatformAndTitle) {
					Logger.logYellow("Adding extended properties to:", model.title);
					let gpp = new PlatformTypeParser();
					model.platformIcon = gpp.parseFromName(model.title, true);
					model.platformImage = gpp.parseFromName(model.platformName, false);

					Logger.logCyan("getGameData() :: Model", model);
				}

				resolve(model);

			}).catch((error) => {
				Logger.logError("getGameData() :: error ::", error);
				reject(error);
			});
		});
	}


	public getProducts(codes: string[]): Promise<IProductData[]> {
		let scope = this;
		let result = new Array<IProductData>();

		function getProductPromise(code: string): Promise<IProductData> {
			return new Promise((resolve, reject) => {
				scope.getGameData(code).then(res => {
					result.push(res);
					resolve(res);

				}).catch(err => {
					console.log("getProducts :: Error getting product ::", err);
					reject(err);
				});
			});
		}

		return new Promise((resolve, reject) => {
			let promises = Array<Promise<IProductData>>();

			for (const code of codes) {
				promises.push(getProductPromise(code));
			}

			Promise.all(
				promises
			).catch((err) => {
				console.log("getProducts :: err ::", err);
				reject(err);
			}).then(() => {
				Logger.logYellow("Promises Done");
				resolve(result);
			});
		});
	}

	//
	// Get Full Vendor List
	//
	public getVendors(): Promise<Array<IVendorModel>> {
		let result = new Array<IVendorModel>();
		let sql = `SELECT * FROM product_vendors`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				for (let i = 0; i < dbRes.result.rowCount(); i++) {
					let dbRow = dbRes.result.dataRows[i];

					let model = new Vendor(
						dbRow.getValAsNum("id"),
						dbRow.getValAsStr("identifier"),
						dbRow.getValAsStr("vendor_type"),
						dbRow.getValAsStr("name"),
						dbRow.getValAsStr("description"),
						dbRow.getValAsStr("website_url"),
						dbRow.getValAsStr("logo_name"),
						dbRow.getValAsStr("color"),
						dbRow.getValAsStr("textColor"),
						dbRow.getValAsStr("colorHighlight")
					);

					result.push(model);
				}

				resolve(result);

			}).catch((error) => {
				Logger.logError("Error Gettings Vendors", error);
				reject(error);
			});
		});
	}
}

if (CliCommander.debug()) {
	console.log("OUTSIDE CODE EXECUTING");
	console.log("DEBUG!");
	let debug = new ProductDb();
	debug.getGameData("0819338020068").then((res) => {
		console.log("ProductDb ::", res);
	}).catch((err) => {
		console.log("ProductDb :: err", err);
	});

} else {
	console.log("NO DEBUG!");
}
