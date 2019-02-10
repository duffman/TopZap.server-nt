/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IgniterSettings }        from '../igniter.settings';
import { IGatlinService }         from '../gatling-service/gatling-service';
import { GatlinService }          from '../gatling-service/gatling-service';
import { GatlingMessage }         from '../gatling-service/gatling-message';
import { IBroadcastMessage }      from '../messaging/boradcast-message';
import { BroadcastMessage}        from '../messaging/boradcast-message';
import { Log }                    from '../igniter-log';
import { PuppetSettings }         from './puppet.settings';
import { AddressInfo }            from "net";



export interface IPuppetPeerBroadcast {
	broadcastPresence(serverPort: number,
					  addressInfo: any,
					  onPeerDiscovered: (data: any, remote: any) => void): void;
}

export class PuppetPeerBroadcast implements IPuppetPeerBroadcast{
	gatlingService: IGatlinService;

	constructor() {
		Log.data("PuppetPeerBroadcas :: construct");
		this.gatlingService = new GatlinService();
	}

	public broadcastPresence(serverPort: number, addressInfo: any = null, onPeerDiscovered: (data: any, remote: any) => void): void {
		let serviceHost = IgniterSettings.Gatling.GATLING_DISCOVERY_HOST;
		let servicePort = PuppetSettings.ServiceBroadcastPort;

		let service = this.gatlingService;
		let addrInfo = addressInfo as AddressInfo;

		console.log("##### ::: serverPort ::", serverPort);

		if (addrInfo === null) {
			Log.error("##### ::: broadcastPresence :: err ::", new Error("No Address Info"));
			return;
		}

		Log.info(`servicePort :: startSignaling :: '${serviceHost}):${servicePort}'`);

		if (service.start(serviceHost, servicePort, onPeerDiscovered) === false) {
			Log.error(`broadcastPresence :: service.start :: error`);
		}
		//
		// Start firing away UDP messages
		//
		let discoveryMessage = new BroadcastMessage(
			PuppetSettings.Local,
			serverPort
		);

		Log.data("##### ::: discoveryMessage ::", discoveryMessage);

		let data = new GatlingMessage(serviceHost, servicePort, discoveryMessage);
		this.gatlingService.emit(data);
	}
}
