/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
/*
import { ISessionBasket }         from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import { SessionIgniter}          from '@components/session-igniter/session-igniter';

export class SessionEntry {
	constructor(public id: string,
				public data: any = null,
				created: Date = new Date()) {}
}

export class SessionManager {
	nodeStorage: boolean = false;
	sessionData: Array<SessionEntry>;
	sessIgnite: SessionIgniter;

	constructor() {
		// In V8 Memory - very very bad, only use while testing or when you fucked up the db
		if (this.nodeStorage) {
			this.sessionData = new Array<SessionEntry>();
		} else {
			this.sess
		}
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
*/