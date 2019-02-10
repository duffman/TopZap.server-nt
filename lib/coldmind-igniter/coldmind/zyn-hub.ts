/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ClientSocket }           from './socket-io.client';
import { SocketServer }           from './zyn-socket.server';
import { EventEmitter }           from 'events';
import { SocketEvents }           from './igniter-event.types';

export class IgniterHub {
	client: ClientSocket;
	server: SocketServer;
	private eventEmitter: EventEmitter;

	constructor(public serverPath: string) {
		this.eventEmitter = new EventEmitter();
		this.client = new ClientSocket();

		this.client.onConnect(() => {
			console.log("Client Connect");
		});

		this.client.onDisconnect(() => {
			console.log("Client DisConnect");
		});

		this.client.onEvent((data: any) => {
			console.log("Client Event ::", data);
		});

		this.client.onMessage((data: any) => {
			console.log("Client Message ::", data);
		});

		this.client.onError((data: any) => {
			console.log("Client Error ::", data);
		});


		this.server = new SocketServer();
	}

	public connectClient(url: string, path: string = null) {
		this.client.connect(url);
	}

	public onNewConnection(listener: any) {
		this.eventEmitter.addListener(SocketEvents.NewConnection, listener);
	}

	public onConnectionClosed(listener: any) {
		this.eventEmitter.addListener(SocketEvents.SocketClosed, listener);
	}

	public onData(listener: any) {
		this.eventEmitter.addListener(SocketEvents.DataAvailable, listener);
	}

	public onError(listener: any) {
		this.eventEmitter.addListener(SocketEvents.Error, listener);
	}
}


let args = process.argv.slice(2);
console.log("args", args);

if (args[1] == "connect") {
	let hub = new IgniterHub(args[0]);
	hub.connectClient("http://localhost:3000", args[0]);
}