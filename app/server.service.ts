/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { injectable }             from "inversify";

export interface IServerService {
}

@injectable()
export class ServerService implements IServerService {
	constructor() {
		console.log("ServerService !!!");
	}
}
