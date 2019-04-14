/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IDbController }          from '@db/db.controller';
import { DBKernel }               from '@putteDb/db-kernel';
import { Logger }                 from '@cli/cli.logger';

export class LoggingDb implements IDbController {
	tableName: string = "log";
	db: DBKernel;

	constructor() {
		this.db = new DBKernel();
	}

	public clearLog(): Promise<boolean> {
		let sql = `DELETE FROM ${this.tableName}`;
		return this.db.runQuery(sql);
	}

	/**
	 * Push new Zap, increase counter
	 * @param {string} code
	 */
	public doLog(section: string, prefix: string, value: any, code: number = 0): Promise<boolean> {

		let valStr = "";

		if (typeof value === "object") {
			valStr = JSON.stringify(value);
		} else {
			valStr = value as string;
		}

		return new Promise((resolve, reject) => {
			let sql = `INSERT INTO ${this.tableName} (id, section, prefix, value, code) VALUES (NULL, '${section}', '${prefix}', '${valStr}', '${code}');`;

			return new Promise((resolve, reject) => {
				this.db.dbQuery(sql).then(res => {
					resolve(true);
				}).catch(err => {
					// Do not throw, just resolve and forget
					resolve(false);
				});
			});
		});
	}
}