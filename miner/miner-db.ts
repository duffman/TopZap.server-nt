/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


/*

UPDATE `price_miner_queue` SET processed_when = NULL WHERE `session_id` = 30 AND processed_when >= DATE_SUB(NOW(), INTERVAL 1 HOUR)

 */

import { DbManager }              from "@putteDb/db-kernel";
import { IDbResult }              from "@putteDb/db-result";
import { DynSQL }                 from "@putteDb/dynsql/dynsql";
import SqlString                  from "@putteDb/dynsql/sql-string";
import { Logger }                 from "@cli/cli.logger";
import { IMinerWorkItem }         from "@miner/miner-session-model";
import { MinerWorkItem }          from "@miner/miner-session-model";
import { MinerWorkItemUpdate }    from "@miner/miner-session-model";
import { MinerSessionModel}       from "@miner/miner-session-model";
import { Guid }                   from "@utils/session-guid";
import { Base64 }                 from "@utils/base64";
import { WorkerItemList }         from "@miner/miner-types";

export class MinerDb {
	db: DbManager;

	constructor() {
		this.db = new DbManager();
		this.init();

		let dynQuery = new DynSQL();

		let data = {
			name: String("mitt namn"),
			type: 12
		};

		let sql = dynQuery.insert(data, "product_vendors").toSQL();
		console.log("SQL ::", sql);
	}

	private init() {}

	public haveMinerSession(vendorId: Number): Promise<boolean> {
		let sql = `SELECT count(*) AS count FROM price_miner_session WHERE vendor_id=${vendorId}`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				let dbRow = dbRes.safeGetFirstRow();
				let haveSession = dbRow.getValAsInt("count") > 0;

				resolve(haveSession);

			}).catch((error) => {
				Logger.logError("getMinerSession :: error ::", error);
				reject(error);
			});
		});
	}

	//
	// Get Product
	// - extended adds pltform image info
	//
	public getWorkQueue(sessionId: number, size: number = -1): Promise<WorkerItemList> {
		//
		// If the barcode is shorter than 13, add a ZERO
		// The reason to why we need this is unknown...
		function prepBarcode(barcode: string): string {
			/*if (barcode.length == 12) {
				return "0" + barcode;
			}*/
			return barcode
		}

		let sql = `SELECT * FROM price_miner_queue WHERE session_id=${sessionId} AND processed_when IS NULL ORDER BY RAND()`;  //SELECT * FROM price_miner_queue vendor_id=${socketId} AND processed_when IS NULL`;
		if (size > -1) {
			sql = sql + ` LIMIT ${size}`
		}

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				let result = new Array<IMinerWorkItem>();

				for (let i = 0; i < dbRes.result.rowCount(); i++) {
					let dbRow = dbRes.result.dataRows[i];

					/*
					let model = new MinerWorkItem(
						dbRow.getValAsInt("id"),
						dbRow.getValAsInt("session_id"),
						dbRow.getValAsStr("barcode"),
						dbRow.getValAsStr("price"),
						dbRow.getValAsStr("processed_when")
					);
					*/

					let model = new MinerWorkItem(
						dbRow.getValAsInt("id"),
						prepBarcode(dbRow.getValAsStr("barcode"))
					);

					result.push(model);
				}

				resolve(result);

			}).catch((error) => {
				Logger.logError("getWorkQueue :: error ::", error);
				reject(error);
			});
		});
	}

	public checkOutWorkQueue(sessionId: number, size: number = 10): Promise<IDbResult> {
		let scope = this;

		return new Promise((resolve, reject) => {
			scope.getWorkQueue(sessionId, size).then((workItems) => {
				let idList = new Array<string>();

				for (let i = 0; i < workItems.length; i++) {
					let item = workItems[i];
					let entry = `id=${item.id}`;
					idList.push(entry);
				}

				let sql = "UPDATE price_miner_queue SET checkout_time=NOW() WHERE " + idList.join(" OR ");

				console.log(sql);

				scope.db.dbQuery(sql).then((res) => {
					resolve(res);

				}).catch((err) => {
					reject(err);
				})
			});
		});
	}

	public addVendor(name: string, type: number = -1): Promise<IDbResult> {
		let dynQuery = new DynSQL();

		let data = {
			name: name,
			type: type
		};

		let sql = dynQuery.insert(data, "product_vendors").toSQL();

		console.log("ADD VENDOR SQL >> ", sql);

		return new Promise((resolve, reject) => {
			/*return this.db.dbQuery(sql).then((dbRes) => {
				resolve(dbRes);
			}).catch((error) => {
				reject(error)
			})*/
		});
	}

	/**
	 * Update a work queue entry with price and date from a given id
	 * @param {number} id
	 * @param {number} price
	 * @returns {<boolean>}
	 */
	public updateWorkQueue(item: MinerWorkItemUpdate): Promise<IDbResult> {
		let scope = this;
		let dynQuery = new DynSQL();
		dynQuery.update("price_miner_queue");
		dynQuery.set("accepted", item.accepted);
		dynQuery.set("price", item.price);
		dynQuery.set("title", item.title);
		dynQuery.set("processed_when", item.price, false);
		dynQuery.set("message", item.message);
		dynQuery.where("price_miner_queue.id", item.id)

		let base64 = new Base64();
		let message = SqlString.escapeString(item.message);

		let sql = `UPDATE price_miner_queue SET `
			+ `accepted=${item.accepted}, `;

		sql = sql + `title='${item.title}', `;

		let strPrice: string = ''+item.price;
		if (strPrice.length > 0)
			sql = sql + `price='${item.price}', `;

		sql = sql + `processed_when=NOW(), `
			+ `message=${message} `
			+ `WHERE id=${item.id} AND session_id=${item.sessionId}`;

		Logger.logGreen("updateWorkQueue :: sql ::", sql);

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				resolve(dbRes);
			}).catch((error) => {
				reject(error)
			});
		});
	}

	public getMinerSession(vendorId: Number): Promise<MinerSessionModel> {
		let sql = `SELECT * FROM price_miner_session WHERE vendor_id=${vendorId} AND completed IS NULL`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				let dbRow = dbRes.safeGetFirstRow();

				console.log("dbRow", dbRow);

				if (dbRow.count() > 0) {
					let model = new MinerSessionModel(
						dbRow.getValAsInt("id"),
						dbRow.getValAsStr("session_key"),
						dbRow.getValAsStr("miner_name"),
						dbRow.getValAsStr("created"),
						dbRow.getValAsInt("vendor_id"),
						dbRow.getValAsInt("completed")
					);

					resolve(model);

				} else {
					reject(new Error("Empty result set"))					;
				}
			}).catch((error) => {
				Logger.logError("getMinerSession :: error ::", error);
				reject(error);
			});
		});
	}

	//
	// Create Miner Session
	//
	public createMinerSession(vendorId: Number, minerName: string = "<noname>"): Promise<IDbResult> {
		let sql = `INSERT INTO price_miner_session (session_key, vendor_id, miner_name, created) `
			+ `VALUES ("${Guid.newGuid()}", ${vendorId}, "${minerName}", NOW())`;

		console.log("SQL", sql);

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				resolve(dbRes);
			}).catch((error) => {
				Logger.logError("createMinerSession", error);
				reject(error);
			});
		});
	}

	//
	// Mark Session As Co
	//
	public setSessionDone(sessionId: number, vendorId: number): Promise<boolean> {
		let sql = `UPDATE price_miner_session SET completed=NOW() WHERE id=${sessionId} AND vendor_id=${vendorId} AND completed IS NULL`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				let success = dbRes.affectedRows > 0;
				resolve(success);
			}).catch((error) => {
				Logger.logError("setSessionDone", error);
				reject(error);
			});
		});
	}

	//
	// Create Miner Work Queue
	//
	public createMinerQueue(sessionId: Number): Promise<boolean> {
		let sql = `INSERT INTO price_miner_queue (session_id, barcode) SELECT ${sessionId}, barcode FROM product_edition`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				let success = dbRes.affectedRows > 0;
				resolve(success);
			}).catch((error) => {
				Logger.logError("Error createMinerQueue", error);
				reject(error);
			});
		});
	}
}
