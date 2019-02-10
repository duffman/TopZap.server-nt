/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IChannelController }     from '@app/channels/channel.controller';
import { EventEmitter }           from 'events';
import { ChannelEvents }          from '@app/channels/channel-events';
import Scaledrone = require('scaledrone-node');
import {ChannelManager} from '@app/channels/channel-manager';
import {IChannelMessage} from '@app/channels/channel-message';
import {ChannelConfig} from '@app/channels/channel-config';
import {IZynMessage} from '@igniter/messaging/igniter-messages';
import {IZynSession} from '@igniter/coldmind/zyn-socket-session';
import {Settings} from '@app/zappy.app.settings';

export class ChannelBaseController implements IChannelController {
	protected drone: any;
	protected channel: any;
	private eventEmitter: EventEmitter;

	log(prefix: string, data: any) {
		console.log("CHANNEL BASE ::" + prefix + "::", data);
	}

	constructor(private channelName: string, private messagePipe: string) {
		let config = new ChannelConfig();
		let channelInfo = config.getChannelData(channelName);

		if (channelInfo === null) {
			let error = new Error("Channel not found");
			throw error;
		}

		this.drone = new Scaledrone(channelInfo.channelID);
		this.channel = this.drone.subscribe(messagePipe);
		this.eventEmitter = new EventEmitter();
		this.attachEventHandlers();
	}

	private attachEventHandlers() {
		let channel = this.channel;

		channel.on(ChannelEvents.ChannelOpen, data => {
			this.eventEmitter.emit(ChannelEvents.ChannelOpen, data);
		});

		channel.on(ChannelEvents.ChannelData, data => {
			this.eventEmitter.emit(ChannelEvents.ChannelData, data);
		});

		channel.on(ChannelEvents.ChannelError, data => {
			this.eventEmitter.emit(ChannelEvents.ChannelError, data);
		});

		channel.on(ChannelEvents.ChannelClose, data => {
			this.eventEmitter.emit(ChannelEvents.ChannelClose, data);
		});

		channel.on(ChannelEvents.ChannelDisconnect, data => {
			this.eventEmitter.emit(ChannelEvents.ChannelDisconnect, data);
		});

		channel.on(ChannelEvents.ChannelReconnect, data => {
			this.eventEmitter.emit(ChannelEvents.ChannelReconnect, data);
		});
	}

	public destroy() {
		this.eventEmitter.removeAllListeners();
	}

	public emitMessage(message: IChannelMessage, messagePipe: string = null) {
		messagePipe = messagePipe !== null ? messagePipe : this.messagePipe;
		this.drone.publish({room: this.messagePipe, message: message});
	}

	public onChannelOpen(listener: any): void {
		this.eventEmitter.addListener(ChannelEvents.ChannelOpen, listener);
	}

	public onChannelData(listener: any): void {
		this.eventEmitter.addListener(ChannelEvents.ChannelData, listener);
	}

	public onChannelError(listener: any): void {
		this.eventEmitter.addListener(ChannelEvents.ChannelError, listener);
	}

	public onChannelClose(listener: any): void {
		this.eventEmitter.addListener(ChannelEvents.ChannelClose, listener);
	}

	public onChannelDisconnect(listener: any): void {
		this.eventEmitter.addListener(ChannelEvents.ChannelDisconnect, listener);
	}

	public onChannelReconnect(listener: any): void {
		this.eventEmitter.addListener(ChannelEvents.ChannelReconnect, listener);
	}

	public doGetOffers(sessId: string, mess: IChannelMessage): void {
		this.log("doGetOffers");

		let code = mess.data.code;
		console.log("### doGetOffers ::", code);

		/*if (!PStrUtils.isNumeric(code)) {
			Logger.logDebugErr("BasketWsApiController :: doGetOffers ::", code);
			this.wss.messError(session.id, mess, new Error("messZapMessageType.ErrInvalidCode"));
			return;
		}*/

		if (Settings.Caching.UseCachedOffers) {
			console.log("### doGetOffers ::", "UseCachedOffers");
			this.getCachedOffers(code, sessId);


		} else {
			console.log("### doGetOffers ::", "SEARCH SERVICE");
			this.emitGetOffersMessage(code, session.id); // Call price service
		}
	}
}
