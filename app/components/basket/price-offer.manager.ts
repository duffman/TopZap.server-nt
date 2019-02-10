/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IClientSocket }          from '@igniter/coldmind/socket-io.client';
import { IZynSocketServer }       from '@igniter/coldmind/zyn-socket.server';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { MessageType }            from '@igniter/messaging/message-types';
import { ZynMessage }             from '@igniter/messaging/igniter-messages';

export class PriceOfferManager {
	constructor(public serviceClient: IClientSocket,
				public wss: IZynSocketServer) {}

	private emitGetOffersInit(socketId: string, data: any): void {
		let mess = new ZynMessage(MessageType.Action, ZapMessageType.GetOffersInit, data, socketId);
		this.wss.sendMessageToSocket(socketId, mess);
	}

	private emitVendorOffer(socketId: string, data: any): void {
		let mess = new ZynMessage(MessageType.Action, ZapMessageType.VendorOffer, data, socketId);
		this.wss.sendMessageToSocket(socketId, mess);
	}

	private emitOffersDone(socketId: string): void {
		let mess = new ZynMessage(MessageType.Action, ZapMessageType.GetOffersDone, {}, socketId);
		this.wss.sendMessageToSocket(socketId, mess);
	}
}