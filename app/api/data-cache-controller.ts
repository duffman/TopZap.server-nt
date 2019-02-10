/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IClientSocket}           from '@igniter/coldmind/socket-io.client';
import { ClientSocket }           from '@igniter/coldmind/socket-io.client';
import { IWSApiController }       from '@api/api-controller';
import { IZynSocketServer }          from '@igniter/coldmind/zyn-socket.server';
import { CachedOffersDb }         from '@db/cached-offers-db';
import { IZynMessage }               from '@igniter/messaging/igniter-messages';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';

export class DataCacheController  implements IWSApiController {
	public initRoutes(routes: any): void {
	}
	wss: IZynSocketServer;
	serviceClient: IClientSocket;
	cachedOffersDb: CachedOffersDb;

	constructor(public debugMode: boolean = false) {
		this.cachedOffersDb = new CachedOffersDb();
	}

	public attachWSS(wss: IZynSocketServer): void {
		this.wss = wss;
	}

	public attachServiceClient(client: ClientSocket): void {
		this.serviceClient = client;
		this.serviceClient.onMessage(this.onServiceMessage.bind(this));
	}

	private onServiceMessage(mess: IZynMessage): void {
		if (mess.id === ZapMessageType.VendorOffer) {
			this.cachedOffersDb.cacheOffer(mess.data);
		}
	}
}
