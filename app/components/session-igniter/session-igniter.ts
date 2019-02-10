/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ISessionStorageEngine }  from '@components/session-igniter/storage-engine';
import  {MysqlSessionEngine }     from '@components/session-igniter/mysql-session-engine';
import { ISessionEntry }          from '@components/session-igniter/session-igniter-entry';
import {Logger} from '@cli/cli.logger';

export interface ISessionIgniter {
	set(sessionId: string, data: any): Promise<ISessionEntry>;
	setEntry(sessionId: string, entry: ISessionEntry): Promise<boolean>;
	get(sessionId: string, autoCreate: boolean): Promise<ISessionEntry>;
}

export class SessionIgniter implements ISessionIgniter {
	engine: ISessionStorageEngine;

	constructor() {
		// This should be made in a dynamic manner, right now as of Jan 14 2019 I don´t have time
		// right now my account balance is zero, mark the balance next time I see this...then evaluate if it´s worth it...
		this.engine = new MysqlSessionEngine();
	}

	public set(sessionId: string, data: any): Promise<ISessionEntry> {
		return new Promise((resolve, reject) => {
			return this.engine.setData(sessionId, data);
		});
	}

	public setEntry(sessionId: string, entry: ISessionEntry): Promise<boolean> {
		return new Promise((resolve, reject) => {
			return this.engine.setData(sessionId, entry).then(res => {
				resolve(res !== null);
			}).catch(err => {
				// Let this one pass
				resolve(false);
				Logger.logAppError(this, "setEntry", err);
			});
		});
	}

	public get(sessionId: string, autoCreate: boolean = true): Promise<ISessionEntry> {
		return new Promise((resolve, reject) => {
			return this.engine.getData(sessionId, autoCreate);
		});
	}
}
