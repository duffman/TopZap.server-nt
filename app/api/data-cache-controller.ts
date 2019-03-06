/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { injectable }             from "inversify";
import { CachedOffersDb }         from '@db/cached-offers-db';
import { IRestApiController }     from '@api/api-controller';

@injectable()
export class DataCacheController  implements IRestApiController {
	cachedOffersDb: CachedOffersDb;

	constructor(public debugMode: boolean = false) {
		this.cachedOffersDb = new CachedOffersDb();
	}

	public initRoutes(routes: any): void {
	}
}
