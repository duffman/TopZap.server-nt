/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { CachedOffersDb }         from '@db/cached-offers-db';
import { IZynMessage }            from '@igniter/messaging/igniter-messages';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { IApiController }         from '@api/api-controller';

export class DataCacheController  implements IApiController {
	cachedOffersDb: CachedOffersDb;

	constructor(public debugMode: boolean = false) {
		this.cachedOffersDb = new CachedOffersDb();
	}

	public initRoutes(routes: any): void {
	}

	private onServiceMessage(mess: IZynMessage): void {
		if (mess.id === ZapMessageType.VendorOffer) {
			this.cachedOffersDb.cacheOffer(mess.data);
		}
	}
}
