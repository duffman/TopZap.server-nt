/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ISessionEntry } from '@components/session-igniter/session-igniter-entry';

export interface ISessionStorageEngine {
	getData(sessId: string, autoCreate: boolean): Promise<ISessionEntry>;
	getDataStr(sessId: string): Promise<string>;
	setEntry(sessId: string, data: ISessionEntry): Promise<ISessionEntry>;
	setData(sessId: string, data: object): Promise<ISessionEntry>;
}
