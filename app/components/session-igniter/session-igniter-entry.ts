/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface ISessionEntry {
	id: string;
	data: any;
}

export class SessionEntry implements ISessionEntry {
	constructor(public id: string,
				public data: any = null,
				created: Date = new Date()) {}
}
