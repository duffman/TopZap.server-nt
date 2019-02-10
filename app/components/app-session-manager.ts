/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { ISessionBasket }         from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import {ISessionIgniter, SessionIgniter} from '@components/session-igniter/session-igniter';
import { ISessionEntry }          from '@components/session-igniter/session-igniter-entry';
import { SessionEntry }           from '@components/session-igniter/session-igniter-entry';
import { Logger }                 from '@cli/cli.logger';

export interface ISessionManager {
	getSession(id: string, autoCreate: boolean): Promise<ISessionEntry>;
	setSessionData(id: string, data: object): Promise<ISessionEntry>;
}

export class AppSessionManager {
	nodeStorage: boolean = false;
	sessionData: Array<SessionEntry>;
	sessIgnite: ISessionIgniter;

	constructor() {
		// In V8 Memory - very very bad, only use while testing or when you fucked up the db
		if (this.nodeStorage) {
			this.sessionData = new Array<SessionEntry>();
		} else {
			this.sessIgnite = new SessionIgniter();
		}
	}

	private getNodeStore(id: string, autoCreate: boolean = true): SessionEntry {
		let result: SessionEntry = null;
		for (const entry of this.sessionData) {
			if (entry.id === id) {
				result = entry;
				break;
			}
		}

		if (result === null && autoCreate) {
			result = new SessionEntry(id);
			this.sessionData.push(result);
		}

		return result;
	}

	public getSession(id: string, autoCreate: boolean = true): Promise<ISessionEntry> {
		/*if (this.nodeStorage) {
			return new Promise((resolve, reject) => {
				let entry = this.getNodeStore(id, autoCreate);
				resolve(entry)
			}).catch(err => {
				Logger.logError("getSession :: nodeStorage :: ERROR ::", err);
			});
		}
		*/
		return this.sessIgnite.get(id, autoCreate);
	}

	public setSessionData(sessId: string, data: object = null): Promise<ISessionEntry> {
		return new Promise((resolve, reject) => {

			return this.getSession(sessId).then(entry => {
				entry.data = data;

				this.sessIgnite.setEntry(sessId, entry).then(res => {
					resolve(entry);

				}).catch(err => {
					Logger.logError("setSessionData :: setEntry ::", err);
					resolve(null);
				});

			}).catch(err => {
				Logger.logError("setSessionData :: ERROR ::", err);
				reject(err);
			});

			/*
			if (entry === null) {
				entry = new SessionEntry(sessId, data);
				this.sessionData.push(entry);
			} else {
				entry.data = data;
			}

			return entry;
			*/



		});
	}

	public setSessionBasket(sessId: string, basket: ISessionBasket): Promise<boolean> {
		let entry = new SessionEntry(sessId, basket);

		return new Promise((resolve, reject) => {
			return this.setSessionData(sessId, entry).then(res => {

			});
		});
	}

	public getSessionBasket(sessId: string, autoCreate: boolean = true): Promise<ISessionBasket> {

		function saveBasket(): Promise<boolean> {
			return new Promise((resolve, reject) => {
			});
		}


		return new Promise((resolve, reject) => {
			return this.getSession(sessId, autoCreate).then(sessEntry => {
				if (sessEntry.data === null) {
					sessEntry.data = new SessionBasket();
					resolve(sessEntry.data);
					//this.setSessionData(sessId, sessEntry.data); //??? Are we operating on the pointer or do we REALLY need this???
				}
			}).catch(err => {
				Logger.logError("getSessionBasket :: ERROR ::", err);
				reject(err);
			})
		});
	}
}
