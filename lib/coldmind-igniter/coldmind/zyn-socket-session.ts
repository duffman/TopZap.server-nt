/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {ExtSioSocket} from '@igniter/coldmind/ext.sio.socket';
import {Logger} from '@cli/cli.logger';

export interface IZynSession {
	id: string;
	sessionId: string;
	sessionData: any;
	socket: ExtSioSocket;
	set(key: string, value: any): void;
	getAs<T>(key: string): T;
	get(key: string): any;
	clear(): void;
}

export class ZynSession implements IZynSession {
	id: string;
	sessionId: string;
	sessionData: any;

	constructor(public socket: ExtSioSocket) {
		this.sessionId = socket.request.sessionID;
		this.sessionData = socket.session;
		this.id = socket.id;
	}

	public set(key: string, value: any): void {
		Logger.logPurple("--- ZynSession set :: key ::", key);
		this.socket.session.set(key, value);
	}

	public getAs<T>(key: string): T {
		return this.get(key) as T;
	}

	public get(key: string): any {
		return this.socket.session.get(key);
	}

	public clear(): void {
		this.socket.session.clearSession();
	}
}
