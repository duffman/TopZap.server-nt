/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as IOServer              from "socket.io";
import * as http                  from "http";
import * as net                   from "net";
import { IOTypes }                from './socket-io.types';
import { SocketEvents }           from '@igniter/coldmind/igniter-event.types';
import { EventEmitter }           from 'events';
import { Server, Socket }         from 'socket.io';
import { IgniterSettings }        from '@igniter/igniter.settings';
import { IZynMessage }            from '@igniter/messaging/igniter-messages';
import { ZynMessage }             from '@igniter/messaging/igniter-messages';
import { MessageUtils }           from '@igniter/messaging/message-utils';
import { MessageType }            from '@igniter/messaging/message-types';
import { MessageFactory }         from '@igniter/messaging/message-factory';
import { ExtSioSocket }           from '@igniter/coldmind/ext.sio.socket';
import { IZynSession }            from '@igniter/coldmind/zyn-socket-session';
import { ZynSession }             from '@igniter/coldmind/zyn-socket-session';
import {Logger} from '@cli/cli.logger';
import {PVarUtils} from '@putte/pvar-utils';

export interface ISocketEntry {
	socketId: string;
	session: IZynSession;
	//socket: ExtSioSocket = null;
}

export class SocketEntry implements ISocketEntry {
	constructor(public socketId: string,
				public session: IZynSession) {}
}

export interface IZynSocketServer {
	getSessionBySocketId(socketId: string): IZynSession;
	getSessionSocketEntry(socketId: string): SocketEntry;
	sendMessageToSocket(socketId: string, message: IZynMessage): boolean;
	sendError(socketId: string, id: string, data: any, tag: string): boolean;
	messError(socketId: string, mess: IZynMessage, err: any): boolean;
	onServerStarted(listener: any): void;
	onServerStartError(listener: any): void;
	onNewConnection(listener: any): void;
	onDisconnect(listener: any): void;
	onEvent(listener: any): void;
	onMessage(listener: any): void;
	onError(listener: any): void;
}

export class SocketServer implements IZynSocketServer {
	public io: IOServer.Server;
	private eventEmitter: EventEmitter;
	httpServer: net.Server;
 	serverPort: number = IgniterSettings.DefSocketServerPort;
	sessionSockets: SocketEntry[];

	constructor() {
		this.eventEmitter = new EventEmitter();
		this.sessionSockets = new Array<SocketEntry>();
	}

	public startListen(port: number = IgniterSettings.DefSocketServerPort): void {
		this.httpServer.listen(port);
	}

	public getSessionBySocketId(socketId: string): IZynSession {
		let result: IZynSession;
		let entry = this.getSessionSocketEntry(socketId);

		if (entry !== null && entry.socketId === socketId) {
			result = entry.session;
		}

		return result;
	}

	public showAllSocketIds(label: string) {
		console.log(" ");
		console.log(label, " -------------");
		console.log("ALL SOCKETS !");
		for (const entry of this.sessionSockets) {
			console.log(": ID: ", entry.socketId);
		}
		console.log(" ");
	}

	public getSessionSocketEntry(socketId: string): SocketEntry {
		console.log("GET SOCKETS :: socketId :", socketId);
		this.showAllSocketIds("getSessionSocketEntry");
		let result: SocketEntry = null;

		for (const entry of this.sessionSockets) {
			if (entry.socketId === socketId) {
				result = entry;
				break;
			}
		}

		return result;
	}

	private setSessionSocket(socket: ExtSioSocket): boolean {
		this.showAllSocketIds("setSessionSocket :: " + socket.id);
		let entry: SocketEntry = this.getSessionSocketEntry(socket.id);

		if (entry !== null) {
			return false;
		}

		entry = new SocketEntry(socket.id, socket.session);
		this.sessionSockets.push(entry);

		return true;
	}

	private removeSessionSocket(socketId: string): boolean {
		let result = false;

		for (let i = 0; i < this.sessionSockets.length; i++) {
			let entry = this.sessionSockets[i];
			if (entry.socketId === socketId) {
				this.sessionSockets.splice(i, 1);
				result = true;
				break;
			}
		}

		return result;
	}

	public emitMessageToSocket(socketId: string, messageType: string, mess: IZynMessage): boolean {
		let result = true;
		let socket = this.io.sockets.connected[socketId];

		if (socket && socket.emit) {
			console.log("Emitting ::");
			socket.emit(messageType, mess);
		} else {
			result = false;
			Logger.logFatalError("")
		}

		return result;
	}

	public sendMessageToSocket(socketId: string, mess: IZynMessage): boolean {
		console.log("sendToSessionId ::", mess);
		return this.emitMessageToSocket(socketId, IOTypes.SOCKET_IO_MESSAGE, mess);
	}

	public sendError(socketId: string, id: string, data: any, tag: string = null): boolean {
		data = data === null ? {} : data;
		let mess = MessageFactory.newIgniterMessage(MessageType.Error, id, data, tag);
		return this.sendMessageToSocket(socketId, mess);
	}

	public messError(socketId: string, mess: IZynMessage, err: any): boolean {
		return this.sendError(socketId, mess.id, JSON.stringify(err), mess.tag);
	}


/*

	public attachSocketIO(socket: Server): void {
		socket.on(IOTypes.SOCKET_IO_CONNECTION, this.onConnect.bind(this));
		socket.on(IOTypes.SOCKET_IO_DISCONNECT, this.socketDisconnect.bind(this));


		socket.on(IOTypes.SOCKET_IO_MESSAGE, (obj1, obj2) => {
			console.log("BALLE :: ", obj1);
			console.log("BALLE :: ", obj2);


			this.handleMessage(obj1, obj2);
		});

		socket.on(IOTypes.SOCKET_IO_MESSAGE, this.handleMessage.bind(this));


		this.io = socket;
	}

	private onConnect(socket: any) { //SocketIOClient.Socket) {
		this.setSessionSocket(socket);

		console.log("SERVER :: New Client Connected!");
		console.log("SERVER :: SESSION ID ::", socket.request.sessionID);
		console.log("SERVER :: SOCKET ID ::", socket.id);
		console.log("SERVER :: SOCKET SESSION ::", !PVarUtils.isNullOrUndefined(socket.session));

		this.handleConnection(socket);
	}

	private socketDisconnect(socket: any = null): void {
		console.log("SERVER->DISCONNECT :: SESSION ID ::", socket.request.sessionID);

		this.removeSessionSocket(socket.id); //socket.request.sessionID);
		this.eventEmitter.emit(SocketEvents.SocketDisconnect, socket);
	}

	private handleConnection(socket: ExtSioSocket) {
		this.eventEmitter.emit(SocketEvents.NewConnection, socket);
		//console.log("----------- socket sug ::", socket);
	}

	private handleMessage(message: any, socket: ExtSioSocket) {
		let dataObj: any = message;

		console.log("handleMessage :: New Client Connected!");
		console.log("handleMessage :: SESSION ID ::", socket.request.sessionID);
		console.log("handleMessage :: SOCKET ID ::", socket.id);
		console.log("handleMessage :: SOCKET SESSION ::", !PVarUtils.isNullOrUndefined(socket.session));

		try {
			if (typeof message === "string") {
				dataObj = JSON.parse(message);
			}

			if (MessageUtils.validateMessageType(dataObj) === false) {
				let errMessage = "Invalid Message Type, does not conform to ZynMessage";
				this.eventEmitter.emit(SocketEvents.Error, errMessage, message);
				return;
			}

		} catch (ex) {
			console.log("Error in handleMessage:: ", message);
			console.log("handleMessage parse failed:", ex);
			this.eventEmitter.emit(SocketEvents.Error, "handleMessage", ex);
			return;
		}

		console.log(">>>>> handleMessage", "Create Socket Session");
		let zynSession = new ZynSession(socket);
		console.log(">>>>> handleMessage :: zynSession ::", zynSession.sessionId);
		let zynMess = new ZynMessage(dataObj.type, dataObj.id, dataObj.vendorBaskets, dataObj.tag);
		message.socket = socket; // Attach socket so that we can reply from within the message <--- HACK

		this.eventEmitter.emit(SocketEvents.NewMessage, zynSession, zynMess);
	}

	*/


	public attachSocketIO(socket: Server): void {
		socket.on(IOTypes.SOCKET_IO_CONNECTION, this.onConnect.bind(this));
		this.io = socket;
	}

	private onConnect(socket: any) { //SocketIOClient.Socket) {
		this.setSessionSocket(socket);
		console.log("SERVER :: New Client Connected ::", socket.id);
		console.log("SERVER :: SESSION ID ::", socket.request.sessionID);

		this.handleConnection(socket);
	}

	private socketDisconnect(socket: any = null): void {
		console.log("SERVER->DISCONNECT :: SESSION ID ::", socket.request.sessionID);

		this.removeSessionSocket(socket.request.sessionID);
		this.eventEmitter.emit(SocketEvents.SocketDisconnect, socket);
	}

	private handleConnection(socket: any) {
		this.eventEmitter.emit(SocketEvents.NewConnection, socket);

		socket.on(IOTypes.SOCKET_IO_DISCONNECT, () => {
			this.socketDisconnect(socket);
		});

		socket.on(IOTypes.SOCKET_IO_MESSAGE, (data) => {
			console.log("<< SERVER :: NEW MESSAGE ::", data);
			this.handleMessage(data, socket);
		});
	}

	private handleMessage(message: any, socket: any) {
		let dataObj: any = message;

		try {
			if (typeof message === "string") {
				dataObj = JSON.parse(message);
			}

			if (MessageUtils.validateMessageType(dataObj) === false) {
				let errMessage = "Invalid Message Type, does not conform to IgniterMessage";
				this.eventEmitter.emit(SocketEvents.Error, errMessage, message);
				return;
			}

		} catch (ex) {
			console.log("Error in handleMessage:: ", message);
			console.log("handleMessage parse failed:", ex);
			this.eventEmitter.emit(SocketEvents.Error, "handleMessage", ex);
			return;
		}

		console.log(">>>>> handleMessage", "Create Socket Session");
		let zynSession = new ZynSession(socket);
		console.log(">>>>> handleMessage :: zynSession ::", zynSession.sessionId);
		let zynMess = new ZynMessage(dataObj.type, dataObj.id, dataObj.data, dataObj.tag);
		message.socket = socket; // Attach socket so that we can reply from within the message <--- HACK

		this.eventEmitter.emit(SocketEvents.NewMessage, zynSession, zynMess);
	}














	public onServerStarted(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.ServerStarted, listener);
	}

	public onServerStartError(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.ServerStartError, listener);
	}

	public onNewConnection(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.NewConnection, listener);
	}

	public onDisconnect(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.SocketDisconnect, listener);
	}

	public onEvent(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.NewEvent, listener);
	}

	public onMessage(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.NewMessage, listener);
	}

	public onError(listener: any): void {
		this.eventEmitter.addListener(SocketEvents.Error, listener);
	}
}


/*
public createServer() {
let httpServer = http.createServer();

httpServer.on('listening', () => {
	console.log("IOServer Listening on port ::", this.serverPort);
	this.eventEmitter.emit(SocketEvents.ServerStarted, this.serverPort);
});

httpServer.on("error", (err) => {
	console.log("IOServer Start Failed ::", err);
	this.eventEmitter.emit(SocketEvents.ServerStartError, err);
});

const io = require('socket.io')({
	serveClient: false,
});

io.attach(httpServer, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: true
});

this.attachSocketIO(io);
this.httpServer = httpServer;
}
*/










/*
let args = process.argv.slice(2);
console.log("args", args);
*/

//let server = new SocketServer(IgniterSettings.DefSocketPath);
