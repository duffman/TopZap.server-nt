/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { IDbController }          from '@db/db.controller';
import { DBKernel }              from '@putteDb/db-kernel';
import { Logger }                 from '@cli/cli.logger';

export class AnalyticsDb implements IDbController {
	tableName: string = "zap_counter";
	db: DBKernel;

	constructor() {
		this.db = new DBKernel();
	}

	/**
	 * Push new Zap, increase counter
	 * @param {string} code
	 */
	public doZap(code: string): Promise<boolean> {
		let scope = this;
		let result = false;

		console.log("********* doZap");

		/*
		function haveItem(): Promise<boolean> {
			let sql = `SELECT COUNT(*) AS count FROM zap-counter WHERE code='${code}'`;
			return new Promise((resolve, reject) => {
				scope.db.dbQuery(sql).then(res => {
					let row res
				});
			});
		}
		*/

		function updateRow(): Promise<boolean> {
			let sql = `UPDATE ${scope.tableName} SET zaps=zaps+1 WHERE code='${code}'`;
			return new Promise((resolve, reject) => {
				scope.db.dbQuery(sql).then(res => {
					resolve(true);
				}).catch(err => {
					// Do not throw, just resolve and forget
					resolve(false);
				});
			});
		}

		function addRow(): Promise<boolean> {
			let sql = `INSERT INTO ${scope.tableName} (code, zaps, last_zap) VALUES ('${code}', 1, CURRENT_TIMESTAMP)`;
			return new Promise((resolve, reject) => {
				scope.db.dbQuery(sql).then(res => {
					resolve(true);
				}).catch(err => {
					// Do not throw, just resolve and forget
					resolve(false);
				});
			});
		}


		async function execute(): Promise<void> {
			let count = await scope.db.countRows(scope.tableName, "code", `='${code}'`);
			try {
				if (count > 0) {
					await updateRow();
				} else {
					await addRow();
				}
			} catch (err) {
				Logger.logError("AnalyticsDb :: doZap ::", err);
				result = false;
			}
		}

		return new Promise((resolve, reject) => {
			execute().then(() => {
				resolve(result);
			});
		});
	}
}