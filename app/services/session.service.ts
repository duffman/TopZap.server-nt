/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { DBKernel }               from '@putteDb/db-kernel';
import { Logger }                 from '@cli/cli.logger';

export interface ISessionService {
	saveSession(sessId: string, data: any, expiresMinutes: number): Promise<boolean>;
	getSession(sessId: string): Promise<any>;
}

export class SessionService implements ISessionService {
	db: DBKernel;

	 // Expiration 7 days and nights
	constructor(public expireMinutes: number = 10080) {
		this.db = new DBKernel();
	}

	/**
	 * Checks to see if the retrieved session is expired.
	 * @returns {boolean}
	 * @private
	 */
	private isExpired(expires: number){
		Logger.logDebug("debug", "Socket.io-mysql-session: _isExpired");
		let now = Math.round((new Date(Date.now()).getTime() / 1000));
		return (now > expires);
	}

	/**
	 * Generates sql string to run to create the table that is needed for this class.
	 * @returns {string}
	 * @private
	 */
	private createTable(): void {
		let sql = `CREATE TABLE session(
					sessionId varchar(32) COLLATE utf8_bin NOT NULL," 
					expires int(11) unsigned NOT NULL,"
					data text COLLATE utf8_bin, PRIMARY KEY (sessionId)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`
	}

	public saveSession(sessId: string, data: any, expiresMinutes: number = -1): Promise<boolean> {
		let sessionData = JSON.stringify(data);

		if (expiresMinutes > -1) {
			expiresMinutes = this.expireMinutes;
		}

		let query = `REPLACE INTO session (sessionId, expires, data)
						VALUES (
						'${sessId}',
						UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL ${expiresMinutes} MINUTE)),
						'${sessionData}')`;


		return new Promise((resolve, reject) => {
			return this.db.dbQuery(query).then(res => {
				resolve(res.success);
			}).catch(err => {
				console.log("dbQuery ERR ::", err);
				reject(err);
			});
		});
	}

	public getSession(sessId: string): Promise<any> {
		let result: any = null;
		let query = `SELECT * FROM session WHERE sessionId ="${sessId}"`;

		return new Promise((resolve, reject) => {
			this.db.dbQuery(query).then(res => {
				let row = res.safeGetFirstRow();
				let data = row.getValAsStr("data");
				let sessionData = data ? JSON.parse(data) : {};

				resolve(sessionData);

			}).catch(err => {
				Logger.logError("getSession ::", err);
				reject(err);
			})
		});
	}
}
