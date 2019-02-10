/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger }                 from "@cli/cli.logger";
import { IWSApiController }       from "@api/api-controller";
import { CliCommander }           from "@cli/cli.commander";
import { IVendorOfferData }       from "@zapModels/zap-offer.model";
import { SocketServer }           from '@igniter/coldmind/zyn-socket.server';
import { IZynMessage }            from '@igniter/messaging/igniter-messages';
import { ZynMessage }             from '@igniter/messaging/igniter-messages';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { MessageType }            from '@igniter/messaging/message-types';
import { ClientSocket }           from '@igniter/coldmind/socket-io.client';
import { CachedOffersDb }         from '@db/cached-offers-db';
import { GetOffersInit }          from '@zapModels/messages/get-offers-messages';
import { IZynSession }            from '@igniter/coldmind/zyn-socket-session';
import Ably = require('ably/callbacks');

export class SearchWsApiController implements IWSApiController {
	wss: SocketServer;
	serviceClient: ClientSocket;
	cachedOffersDb: CachedOffersDb;

	channel: any;

	constructor(public debugMode: boolean = false) {
		this.cachedOffersDb = new CachedOffersDb();

		let ably = new Ably.Realtime("CRJz2w.jyPfYw:ED3ZFMwBKD7EY_LQ");
		this.channel = ably.channels.get("bids");
	}

	public initRoutes(routes: any): void {
	}

	/**
	 * Emit Search Message through Search Service
	 * @param {string} code
	 * @param {string} socketId
	 */
	private emitGetOffersMessage(code: string, socketId: string): void {
		let scope = this;

		let messageData = {
			code: code
		};

		this.serviceClient.sendMessage(MessageType.Action, ZapMessageType.GetOffers, messageData, socketId);
		this.serviceClient.onMessage(this.onServiceMessage.bind(this));
	}

	/*****
	 *
	 *  Emit Messages To User Session
	 *
	 */
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

	public doGetOffers(code: string, socketId: string): void {
		let scope = this;
		console.log("doGetOffers :: " + code + " :: " + socketId);

		this.channel.publish('greeting', 'hello!');

		this.cachedOffersDb.getCachedOffers(code).then(res => {
			return res;
		}).catch(err => {
			console.log("doGetOffers :: Catch ::", err);
			return null;

		}).then((cachedRes: Array<IVendorOfferData>) => {
			console.log("Final THEN ::", cachedRes);

			//
			// Simulate Messages Sent using a regular lookup
			//
			if (cachedRes) {
				scope.emitGetOffersInit(socketId, new GetOffersInit(cachedRes.length));
				for (const entry of cachedRes) {
					scope.emitVendorOffer(socketId, entry);
				}
				scope.emitOffersDone(socketId)

			//
			// Lookup offers through the price service
			//
			} else {
				scope.emitGetOffersMessage(code, socketId); // Call price service
			}
		});
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

		try {
			if (this.debugMode) {
				Logger.logYellow("WSSERVER :: Message ::", mess.data);
				Logger.logYellow("WSSERVER :: Session ID ::", session.sessionId);
			}

			if (mess.id === ZapMessageType.GetOffers) {
				let code = mess.data.code;
				if (this.debugMode) Logger.logYellow("GET OFFERS :: CODE ::", code);
				this.doGetOffers(code, session.sessionId);
			}

		} catch (err) {
			Logger.logFatalError("onClientMessage")			
		}
	}

	public attachServiceClient(client: ClientSocket): void {
		this.serviceClient = client;
		this.serviceClient.onMessage(this.onServiceMessage.bind(this));
	}

	/**
	 * New Message from Search Service
	 * @param {IZynMessage} mess
	 */
	private onServiceMessage(mess: IZynMessage): void {
		let scope = this;

		if (mess.id === ZapMessageType.GetOffersInit) {
			scope.emitGetOffersInit(mess.tag, mess.data);
		}

		if (mess.id === ZapMessageType.VendorOffer) {
			scope.emitVendorOffer(mess.tag, mess.data);
		}

		if (mess.id === ZapMessageType.GetOffersDone) {
			scope.emitOffersDone(mess.tag);
		}
	}
}

if (CliCommander.debug()) {
	console.log("OUTSIDE CODE EXECUTING");
	let app = new SearchWsApiController();
	//app.doDebugSearch(null, null);
}
