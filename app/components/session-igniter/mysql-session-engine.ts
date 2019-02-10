/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import SqlString                  from '@putteDb/dynsql/sql-string';
import { ISessionStorageEngine }  from '@components/session-igniter/storage-engine';
import { DbManager}               from '@putteDb/db-kernel';
import { Logger }                 from '@cli/cli.logger';
import { CliDebugYield }          from '@cli/cli.debug-yield';
import { ISessionEntry }          from '@components/session-igniter/session-igniter-entry';
import { SessionEntry }           from '@components/session-igniter/session-igniter-entry';

export class MysqlSessionEngine implements ISessionStorageEngine {
	db: DbManager;
	tableName: string = "session_storage";
	dataColumn: string = "data";

	constructor() {
		this.db = new DbManager();
	}

	public createEntry(sessId: string): Promise<ISessionEntry> {
		return this.setData(sessId, new SessionEntry(sessId));
	}

	public getData(sessId: string, autoCreate: boolean = true): Promise<ISessionEntry> {
		const sql = `SELECT name, ${this.dataColumn} FROM ${this.tableName} WHERE name='${sessId}'`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then(res => {

				if (!res.haveAny() && autoCreate) {
					return this.createEntry(sessId);
				} else if (!res.haveAny() && !autoCreate) {
					resolve(null);
				} else {
					let row = res.safeGetFirstRow();
					let dataStr = row.getValAsStr(this.dataColumn);
					let jsonObj = JSON.parse(dataStr);
					let entry = new SessionEntry(sessId, jsonObj.data);
					resolve(entry);
				}

			}).then(res => {
				resolve(res);

			}).catch(err => {
				const errMess = "MysqlSessionEngine :: getData :: ERROR ::";
				Logger.logFatalError(errMess, err);
				CliDebugYield.fatalError(errMess, err);
				reject(err);
			});
		});
	}

	public getDataStr(sessId: string): Promise<string> {
		/*
		return new Promise((resolve, reject) => {
			return this.getData(sessId).then(data => {





				resolve(data);
			}).catch(err => {
				const errMess = "MysqlSessionEngine :: getDataStr :: ERROR ::";
				Logger.logFatalError(errMess, err);
				CliDebugYield.fatalError(errMess, err);
				reject(err);
			});
		});
		*/

		throw new Error("Not implemented");
	}

	public setEntry(sessId: string, data: ISessionEntry): Promise<ISessionEntry> {
		return this.setData(sessId, data.data);
	}

	public setData(sessId: string, data: object): Promise<ISessionEntry> {
		function isSessionEntry(obj: any): boolean {
			let result = false;
			let objType = typeof obj;

			if (objType === "object") {
				result = (obj.hasOwnProperty("id")) && obj.hasOwnProperty("data");
			}

			return result;
		}

		let entry: ISessionEntry;

		if (!isSessionEntry(data)) {
			entry = new SessionEntry(sessId, data);
		} else {
			entry = data as ISessionEntry;
		}

//		let entry = new SessionEntry(sessId, data);

		const dataStr = SqlString.escape(entry);
		const sql = `REPLACE INTO session_storage (id, name, data, data_type) VALUES (NULL, '${sessId}', '${dataStr}', NULL)`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then(res => {
				if (res.success) {
					resolve(entry);
				} else {
					resolve(null);
				}

			}).catch(err => {
				const errMess = "MysqlSessionEngine :: setData :: ERROR ::";
				Logger.logFatalError(errMess, err);
				CliDebugYield.fatalError(errMess, err);
				reject(err);
			});
		});
	}
}
