/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import { Logger }                 from "@cli/cli.logger";
import { DbManager }              from "@putteDb/db-kernel";
import { DynSQL }                 from "@putteDb/dynsql/dynsql";
import { IDbResult }              from "@putteDb/db-result";

export class ProgressRec {
	constructor(public totalCount: number,
				public successCount: number,
				public processedCount: number
	) {}
}

export class MinerStatucRec {
	constructor(
				public sessionId: number,
				public minerName: string,
				public vendorId: number,
				public sessionKey: string,
				public completed: string,
				public totalCount: number,
				public successCount: number,
				public processedCount: number,
				public percentDone: number
	) {}
}


export class MinerStatus {
	db: DbManager;

	constructor() {
		this.db = new DbManager();
	}

	public getSessionInfo(): Promise<IDbResult> {
		let dynSql = new DynSQL();

		let sql = dynSql.select("ms.id", "ms.session_key", "ms.completed", "pv.id AS pv_id", "pv.name")
			.from("price_miner_session", "ms")
			.from("product_vendors", "pv")
			.where(
				"pv.id", "ms.vendor_id", false
			).toSQL();

		console.log(sql);

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then((dbRes) => {
				resolve(dbRes);
			}).catch((error) => {
				Logger.logError("getMinerSession :: error ::", error);
				reject(error);
			});
		});
	}

	public getProgressInfo(): Promise<Array<MinerStatucRec>> {
		let scope = this;
		let result = new Array<MinerStatucRec>();

		function getSessionDbRes(): Promise<IDbResult> {
			return new Promise((resolve, reject) => {
				return scope.getSessionInfo().then((dbRes) => {
					resolve(dbRes);
				}).catch((error) => {
					Logger.logError("getMinerSession :: error ::", error);
					reject(error);
				});
			});
		}

		function getSessionProg(sessionId: number): Promise<ProgressRec> {
			let sql = `SELECT (SELECT COUNT(*) FROM price_miner_queue WHERE session_id = ${sessionId}) AS totalCount,
			(SELECT COUNT(*) FROM price_miner_queue WHERE session_id = ${sessionId} AND processed_when IS NOT NULL AND price > -1) AS successCount,
			(SELECT COUNT(*) FROM price_miner_queue WHERE session_id = ${sessionId} AND processed_when IS NOT NULL) AS processedCount`;

			return new Promise((resolve, reject) => {
				return scope.db.dbQuery(sql).then((dbRes) => {
					let row = dbRes.safeGetFirstRow();

					let result = new ProgressRec(
						row.getValAsNum("totalCount"),
						row.getValAsNum("successCount"),
						row.getValAsNum("processedCount")
					);

					resolve(result);

				}).catch((error) => {
					Logger.logError("getMinerSession :: error ::", error);
					reject(error);
				});
			});
		}

		async function getInfo(): Promise<void> {
			let sessionInfo = await getSessionDbRes();

			for (let i = 0; i < sessionInfo.result.rowCount(); i++) {
				let row = sessionInfo.result.dataRows[i];

				let sessId = row.getValAsNum("id");
				let name = row.getValAsStr("name");
				let vendorId = row.getValAsNum("pv_id");
				let sessKey = row.getValAsStr("session_key");
				let completed = row.getValAsStr("completed");

				let progRec = await getSessionProg(sessId);

				let percentDone = (progRec.processedCount / progRec.totalCount ) * 100;

				let statusRec = new MinerStatucRec(
					sessId,
					name,
					vendorId,
					sessKey,
					completed,
					progRec.totalCount,
					progRec.successCount,
					progRec.processedCount,
					percentDone
				);

				result.push(statusRec);
			}
		}

		return new Promise((resolve, reject) => {
			getInfo().then(() => {
				resolve(result);
			})
		});
	}
}