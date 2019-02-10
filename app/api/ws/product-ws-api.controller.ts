/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IWSApiController }       from '@api/api-controller';
import {IZynSocketServer, SocketServer} from '@igniter/coldmind/zyn-socket.server';
import {ClientSocket, IClientSocket} from '@igniter/coldmind/socket-io.client';
import {IZynMessage} from '@igniter/messaging/igniter-messages';
import {ZapMessageType} from '@zapModels/messages/zap-message-types';
import {IZynSession} from '@igniter/coldmind/zyn-socket-session';

export class ProductWsApiController implements IWSApiController {
	debugMode: boolean;
	wss: IZynSocketServer;
	serviceClient: IClientSocket;

	public attachWSS(wss: IZynSocketServer): void {
		this.wss = wss;
		this.wss.onMessage(this.onClientMessage.bind(this));
	}

	/**
	 * New Message from a User Session/Device
	 * @param {IZynMessage} mess
	 */
	private onClientMessage(session: IZynSession, mess: IZynMessage): void {
		if (mess.id === ZapMessageType.GetVendors) {
		}
	}

	public attachServiceClient(client: IClientSocket): void {
		this.serviceClient = client;
		this.serviceClient.onMessage(this.onServiceMessage.bind(this));
	}

	/**
	 * New Message from Search Service
	 * @param {IZynMessage} mess
	 */
	private onServiceMessage(mess: IZynMessage): void {
	}

	public initRoutes(routes: any): void {
	}
}