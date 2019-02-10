/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {ISessionBasket, SessionBasket} from '@zapModels/session-basket';

export class SessionEntry {
	constructor(public id: string,
				public data: any = null,
				created: Date = new Date()) {}
}

export class SessionManager {
	sessionData: Array<SessionEntry>;

	constructor() {
		this.sessionData = new Array<SessionEntry>();
	}

	public getSession(id: string, autoCreate: boolean = true): SessionEntry {
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

	public setSessionData(id: string, data: any = null): SessionEntry {
		let entry = this.getSession(id);
		if (entry === null) {
			entry = new SessionEntry(id, data);
			this.sessionData.push(entry);
		} else {
			entry.data = data;
		}

		return entry;
	}

	public getSessionBasket(sessId: string): ISessionBasket {
		let sessEntry = this.getSession(sessId);

		if (sessEntry.data === null) {
			sessEntry.data = new SessionBasket();
			//this.setSessionData(sessId, sessEntry.data); //??? Are we operating on the pointer or do we REALLY need this???
		}

		return sessEntry.data;
	}
}