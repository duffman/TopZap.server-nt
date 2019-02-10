/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IgniterSettings } from '../igniter.settings';
import {Socket} from 'dgram';
import {IGatlingMessage} from './gatling-message';
import {PuppetSettings} from '../puppet-peer/puppet.settings';
import {Log} from '../igniter-log';

//import Socket as DGramSocket from "dgram";

const dgram = require('dgram');

export interface IGatlinService {
	start(host: string, port: number, callback: (data: any, remote: any) => void): boolean;
	emit(message: IGatlingMessage): void;
}

export class GatlinService implements IGatlinService {
	sender: Socket;
	listener: Socket;
	timer: any;
	timerInterval = 5000;

	private createDGramSocket(): Socket {
		let options = {type: "udp4", reuseAddr: true};
		let dgramSock = dgram.createSocket(options);
		return dgramSock;
	}

	constructor() {
		this.sender = this.createDGramSocket(); // dgram.createSocket('udp4');
		this.listener = this.createDGramSocket(); // dgram.createSocket('udp4');
	}

	private emitMessage(message: IGatlingMessage): void {
		let dataStr = JSON.stringify(message.data);
		Log.data("DATA STRING ::", dataStr);
		const messageBuf: Buffer = Buffer.from(dataStr);

		try {
			this.sender.send(messageBuf, 0, messageBuf.length, message.port, message.host, (err, bytes) => {
				if (err) throw err;
				console.log('UDP message sent to ' + message.host + ':' + message.port);
				//this.sender.close();
			});

		} catch (err) {
			Log.info("Gatling Service :: error emitting message");
			//Log.error("emitMessage :: error ::", new Error("error emitting"));
			Log.error("emitMessage :: error ::", err);
			
			if (err === "ERR_SOCKET_DGRAM_NOT_RUNNING") {
				console.log("not running");
			}


			//ERR_SOCKET_DGRAM_NOT_RUNNING
		}
	}

	public emit(bullet: IGatlingMessage): void {
		let scope = this;
		this.timer = setInterval(function() { scope.emitMessage(bullet) }, scope.timerInterval);
	}

	public start(host: string, port: number, callback: (data: any, remote: any) => void): boolean {
		/*
		var done = undefined;

		done = (function wait () {
			// As long as it's nor marked as done, create a new event+queue
			if (!done) setTimeout(wait, 1000);
			// No return value; done will resolve to false (undefined)
		})();
		*/

		this.listener.on('listening', () => {
			this.listener.addMembership(PuppetSettings.MulticastAddress);
			const address = this.listener.address();
			Log.data('UDP Server listening on ', address);
		});

		this.listener.on('message', (message, remote) => {
			callback(message, remote);
			console.log(remote.address + ':' + remote.port +' - ' + message);
		});

		try {
			this.listener.bind(port, host);

		} catch(ex) {
			Log.error("updtest: bind() error: " + ex.stack);
			return false;
		}

		return true;
	}
}
