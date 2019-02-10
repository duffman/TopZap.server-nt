/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IClientSocket }          from '@igniter/coldmind/socket-io.client';
import { ClientSocket }           from '@igniter/coldmind/socket-io.client';
import { IZynMessage }               from '@igniter/messaging/igniter-messages';
import { MessageType }            from '@igniter/messaging/message-types';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { DbManager }              from '@putteDb/db-kernel';
import { ProductDb }              from '@db/product-db';

export interface IPriceSearchService {
	doPriceSearch(code: string): Promise<IZynMessage>;
}

export class PriceSearchService implements IPriceSearchService {
	db: DbManager;
	productDb: ProductDb;

	constructor(public serviceClient: IClientSocket) {
	}

	public doPriceSearch(code: string, sessId: string = null): Promise<IZynMessage> {
		let messageData = {
			code: code
		};

		return this.serviceClient.sendAwaitMessage(MessageType.Action, ZapMessageType.GetOffers, messageData, sessId);
	}
}
