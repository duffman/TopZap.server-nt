/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { DbKernel }               from '@putteDb/db-kernel-new';

export interface ISessionService {
	getEntry(sessId: string, key: string): any;
}

export class SessionService implements ISessionService {
	db: DbKernel;

	constructor() {
		this.db = new DbKernel();
	}

	public getEntry(sessId: string, key: string): any {
		let result: any = null;
		return result;
	}
}
