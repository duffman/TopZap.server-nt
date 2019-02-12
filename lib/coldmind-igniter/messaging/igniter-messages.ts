/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { MessageType }            from '@igniter/messaging/message-types';
import { Socket }                 from 'socket.io';
import { SocketEvents }           from '@igniter/coldmind/igniter-event.types';
import { IOTypes }                from '@igniter/coldmind/socket-io.types';
import {Logger} from '@cli/cli.logger';
import {ExtSioSocket} from '@igniter/coldmind/ext.sio.socket';

export interface IgniterMessageType {
	type: string;
	id: string;
	data?: null;
	tag:  null;
}

// Converts JSON strings to/from your types
export namespace IgniterMessageType {
	export function toIgniterMessageType(json: string): IgniterMessageType {
		return JSON.parse(json);
	}

	export function igniterMessageTypeToJson(value: IgniterMessageType): string {
		return JSON.stringify(value);
	}
}

export interface IZynMessage {
	type: string;
	id: string;
	data: any;
	tag: string;
	session: string;
//	socket: ExtSioSocket;

	is(type: string): boolean;
	idIs(id: string): boolean;

	/*
	ack(): void;
	reply(type: string, id: string, vendorBaskets: any): void;
	replyTyped(id: string, vendorBaskets: any): void;
	error(error: Error): void;
	errorGeneric(): void;
	*/
}

export class ZynMessage implements IZynMessage {
	session: string;
	socket: ExtSioSocket;

	constructor(public type: string,
				public id: string,
				public data: any,
				public tag: string = null) {
	}

	public is(type: string): boolean {
		return (this.type === type);
	}

	public idIs(id: string): boolean {
		return (this.id === id);
	}

	/*
	public ack(): void {console.log("QUACKING!!!");
		let igniterMessage = new ZynMessage(MessageType.Ack, this.id, null, this.tag);
		this.socket.emit(IOTypes.SOCKET_IO_MESSAGE, igniterMessage);
		console.log("Ack Message Done");
	}

	public replyTyped(id: string, vendorBaskets: any): void {
		this.reply(this.type, id, vendorBaskets);
	}

	public reply(type: string, id: string, vendorBaskets: any = null): void {
		let igniterMessage = new ZynMessage(type, id, vendorBaskets, this.tag);
		Logger.logDebug("Reply Message ::", igniterMessage);
		this.socket.emit(IOTypes.SOCKET_IO_MESSAGE, igniterMessage);
	}

	public error(error: Error): void {
		this.reply(MessageType.Error, "error", JSON.stringify(error));
	}

	public errorGeneric(): void {
		this.error(new Error("Error 50001: Internal screw-up!"));
	}
	*/
}
