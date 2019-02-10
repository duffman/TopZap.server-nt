/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

//let io = require('socket.io-coldmind');
//import * as ASocketIOClient from "socket.io-coldmind";

import { Socket }                 from 'socket.io';
import * as io                    from 'socket.io-client';
import { IOTypes }                from './socket-io.types';
import { EventEmitter }           from 'events';
import { SocketEvents }           from './igniter-event.types';
import { IZynMessage}                from '@igniter/messaging/igniter-messages';
import { IgniterMessageType }     from '@igniter/messaging/igniter-messages';
import { MessageType}             from '@igniter/messaging/message-types';
import { MessageFactory }         from '@igniter/messaging/message-factory';
import { IgniterSettings }        from '@igniter/igniter.settings';
import { MessageUtils }           from '@igniter/messaging/message-utils';

export class PromiseAwaitInfo {
	constructor(public tag: string,
				public resolver: any = null,
				public rejecter: any = null,
				public promise: Promise<IZynMessage> = null) {}
}

export interface IClientSocket {
	connect(url: string);

	sendMessage(messageType: string, id: string, data: any, tag: string): IZynMessage;

	sendAwaitMessage(messageType: string, id: string, data: any, tag: string): Promise<IZynMessage>;

	emitMessageRaw(data: any);

	onConnect(listener: any);

	onDisconnect(listener: any);

	onEvent(listener: any);

	onMessage(listener: any);

	onError(listener: any);
}

export class ClientSocket implements IClientSocket {
	private socket: SocketIOClient.Socket;
	private eventEmitter: EventEmitter;
	private awaitStack: Array<PromiseAwaitInfo>;

	constructor() {
		this.eventEmitter = new EventEmitter();
		this.awaitStack = new Array<PromiseAwaitInfo>();
	}

	private findAwaitByTag(tag: string, removeEntry: boolean = true): PromiseAwaitInfo {
		let result: PromiseAwaitInfo = null;

		//for (const item of this.awaitStack) {
		for (let i = 0; i < this.awaitStack.length; i++) {
			let item = this.awaitStack[i];

			if (item.tag === tag) {
				if (removeEntry) {
					this.awaitStack.slice(i, 1);
					console.log('Slice Remove promise from awaitStack');
				}

				result = item;
				break;
			}
		}

		return result;
	}

	private awaitMessage(message: IZynMessage): Promise<IZynMessage> {
		if (this.findAwaitByTag(message.tag) !== null) {
			return null;
		}

		let awaiter = new PromiseAwaitInfo(message.tag);
		awaiter.promise = new Promise<IZynMessage>((resolve, reject) => {
			awaiter.resolver = resolve;
			awaiter.rejecter = reject;
		});

		this.awaitStack.push(awaiter);

		return awaiter.promise;
	}

	private parseIncomingMessage(data: IgniterMessageType): void {
		console.log("PARSE INCOMING MESSAGE ::", data);
		let awaitInfo = this.findAwaitByTag(data.tag);

		if (awaitInfo !== null) {
			awaitInfo.resolver(data);

		} else { // No awaiting promise, simply pass it on...
			this.eventEmitter.emit(SocketEvents.NewMessage, data);
		}
	}

	// -- //

	public connect(url: string = null) {
		console.log("Doing Client Connect ::");

		if (url === null) {
			url = "http://localhost:" + IgniterSettings.DefSocketServerPort;
		}

		console.log("Connecting...");
		let options = {
			reconnection: true,
		//	path: "/" + this.serverPath
		};

		this.socket = io.connect(url, options);
		this.assignEventHandlers(this.socket);
	}

	public sendMessage(messageType: string, id: string, data: any, tag: string = null): IZynMessage {
		let message = MessageFactory.newIgniterMessage(messageType, id, data, tag);
		console.log("Sending Message ::", message);
		this.socket.emit(IOTypes.SOCKET_IO_MESSAGE, message);
		return message;
	}

	public sendAwaitMessage(messageType: string, id: string, data: any, tag: string = null): Promise<IZynMessage> {
		let message = this.sendMessage(messageType, id, data, tag);
		return this.awaitMessage(message);
	}

	public emitMessageRaw(data: any) {
		console.log("emitMessageRaw ::", data);
		this.socket.emit(IOTypes.SOCKET_IO_MESSAGE, data);
	}

	private assignEventHandlers(client: SocketIOClient.Socket) {
		client.on(IOTypes.SOCKET_IO_CONNECT, this.socketConnect.bind(this));
		client.on(IOTypes.SOCKET_IO_DISCONNECT, this.socketDisconnect.bind(this));
		client.on(IOTypes.SOCKET_IO_EVENT, this.socketEvent.bind(this));
		client.on(IOTypes.SOCKET_IO_MESSAGE, this.socketMessage.bind(this));
	}

	private socketConnect() {
		this.eventEmitter.emit(SocketEvents.SocketConnect);
	}

	private socketDisconnect(data: any) {
		console.log("ON DISCONNECT!");
		this.eventEmitter.emit(SocketEvents.SocketDisconnect);
	}

	private socketEvent(data: any) {
		console.log("ON EVENT!");
		this.eventEmitter.emit(SocketEvents.NewEvent, data);
	}

	private socketMessage(dataObj: any) {
		if (MessageUtils.validateMessageType(dataObj) === false) {
			let errMessage = "Invalid Message Type, does not conform to ZynMessage";
			this.eventEmitter.emit(SocketEvents.Error, errMessage, dataObj);
			return;
		}

		this.parseIncomingMessage(dataObj as IgniterMessageType);
	}

	//----------------//

	public onConnect(listener: any) {
		this.eventEmitter.addListener(SocketEvents.SocketConnect, listener);
	}

	public onDisconnect(listener: any) {
		this.eventEmitter.addListener(SocketEvents.SocketClosed, listener);
	}

	public onEvent(listener: any) {
		this.eventEmitter.addListener(SocketEvents.NewEvent, listener);
	}

	public onMessage(listener: any) {
		this.eventEmitter.addListener(SocketEvents.NewMessage, listener);
	}

	public onError(listener: any) {
		this.eventEmitter.addListener(SocketEvents.Error, listener);
	}
}

/*

let args = process.argv.slice(2);
console.log("args", args);

let client = new ClientSocket(IgniterSettings.DefSocketPath);

client.onConnect(() => {
	console.log("onConnect::::");
	let mess = {
		age: 12,
		kalle: "kula"
	};

	client.emitMessage(mess);
});

client.connect("http://localhost:3700");
*/