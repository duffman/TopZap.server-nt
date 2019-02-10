/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IWSApiController }       from '@api/api-controller';
import { ClientSocket }           from '@igniter/coldmind/socket-io.client';
import { IZynSocketServer }          from '@igniter/coldmind/zyn-socket.server';
import { SocketServer}            from '@igniter/coldmind/zyn-socket.server';
import {IZynMessage, ZynMessage} from '@igniter/messaging/igniter-messages';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { ProductDb }              from '@db/product-db';
import { MessageType }            from '@igniter/messaging/message-types';
import {IZynSession } from '@igniter/coldmind/zyn-socket-session';

export class ServiceWsApiController implements IWSApiController {
	wss: IZynSocketServer;
	serviceClient: ClientSocket;
	productDb: ProductDb;

	constructor(public debugMode: boolean) {
		this.productDb = new ProductDb();
	}

	public attachServiceClient(client: ClientSocket): void {
		this.serviceClient = client;
		this.serviceClient.onMessage(this.onServiceMessage.bind(this));
	}

	private onServiceMessage(mess: IZynMessage): void {
		let scope = this;
	}

	public attachWSS(wss: SocketServer): void {
		this.wss = wss;
		this.wss.onMessage(this.onClientMessage.bind(this));
	}

	/**
	 * New Message from a User Session/Device
	 * @param {IZynMessage} mess
	 */
	private onClientMessage(session: IZynSession, mess: IZynMessage): void {
		let scope = this;

		if (mess.id === ZapMessageType.GetVendors) {
			this.onGetVendors(session, mess);
		}
	}

	private onGetVendors(session: IZynSession, mess: IZynMessage): void {
		this.productDb.getVendors().then(res => {
			let zynMessage = new ZynMessage(MessageType.Action, ZapMessageType.VendorsList, res, mess.tag);
			this.wss.sendMessageToSocket(session.id, zynMessage);

		}).catch(err => {
			this.wss.messError(session.id, mess,  new Error("ERROR_GETTING_VENDORS"));
		});
	}

	public initRoutes(routes: any): void {}
}
