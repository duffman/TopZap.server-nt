/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IPuppetClient }          from './puppet-client';
import { IClientOptions }         from './puppet-client';
import { PuppetClient }           from './puppet-client';
import { IPuppetServer }          from './puppet-server';
import { PuppetServer }           from './puppet-server';
import { IPuppetPeerBroadcast }   from './puppet-peer-broadcast';
import { PuppetPeerBroadcast }    from './puppet-peer-broadcast';
import { Log }                    from '../igniter-log';
import { IgniterCli }             from '../igniter-cli';
import { DiscoveryMessData }      from '../messaging/boradcast-message';
import { DataConvert }            from '../messaging/boradcast-message';
import { PuppetSettings }         from './puppet.settings';
import { ISrvListenResult }       from "../types/listener-result";
import { SrvListenResult }        from "../types/listener-result";
import { IgniterSettings }        from "../igniter.settings";
import {EventType} from '@igniter/messaging/event-types';

export interface IPuppetHub {
	startServer(serverPort: number): Promise<ISrvListenResult>;
}

export class PuppetHub implements IPuppetHub {
	hubName: string;
	serverPort: number;
	client: IPuppetClient;
	server: IPuppetServer;
	serviceBroadcast: IPuppetPeerBroadcast;

	private broadcastPresence(listenResult: ISrvListenResult): void {
		let broadcastPort = PuppetSettings.ServiceBroadcastPort;
		Log.data("Broadcast Port ::", broadcastPort);
		this.serviceBroadcast = new PuppetPeerBroadcast();
		this.serviceBroadcast.broadcastPresence(this.serverPort, listenResult.addressInfo, this.onMessage.bind(this));
	}

	constructor(name: string) {
		Log.info("PuppetHub :: name ::", name);
		this.hubName = name;
		this.client = new PuppetClient();
		this.server = new PuppetServer();

	}

	public startServer(port: number = -1): Promise<ISrvListenResult> {
		this.serverPort = port;
		let scope = this;
		let result = new SrvListenResult();
		Log.info(`startServer :: port(${this.serverPort})`);

		return new Promise((resolve, reject) => {
			scope.server.startListening(this.serverPort).then(res => {
				Log.data("server.startListening ::", res);
				if (res.success) {
					result.success = true;
					this.broadcastPresence(res);
				}

				resolve(result);

			}).catch(err => {
				resolve(result);
			});
		});
	}

	private onDiscoveryMessage(messData: DiscoveryMessData): void {
		Log.data("onDiscoveryMessage :: messData ::", messData);

		if (messData.data.action === EventType.Actions.Connect) {
			Log.data("onDiscoveryMessage :: action === connect", messData);

			let clientOptions: IClientOptions = {
				host: messData.host,
				port: messData.port,
				retryAlways: true,
				reConnectInterval: IgniterSettings.ReConnectInterval
			};

			this.client.connect(clientOptions).then(res => {
				if (res) {
					Log.info("TCP Client Connect Success!!");
				} else {
					Log.info("TCP Client Connect FAIL!!");
				}
			});
		}
	}

	private onMessage(data, remote): void {
		let message = DataConvert.toDiscoveryMessData(data);
		let messData = message as DiscoveryMessData;

		if (messData && messData.data && messData.data.type === EventType.Broadcast) {
			this.onDiscoveryMessage(messData);
		}

		console.log("onDiscoveryMessage ::", message);
	}
}

let args = process.argv.slice(2);
console.log("args", args);

if (IgniterCli.startHub()) {
	console.log("Start HUB");
	let portNum: number = -1;
	let hubName: string = args[2];

	try {
		portNum = Number.parseInt(args[1]);
	} catch(ex) {
		console.log("Invalid Service Listener Port");
		process.exit(345);
	}

	let hub = new PuppetHub(hubName);
	hub.startServer(portNum).then(res => {
		Log.data("Start Server Res ::", res);
	});

} else {
	Log.error("PuppetHub :: start :: error", new Error("Incorrect param count"))
}
