/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { Interface, kernel, Tag } from '@root/kernel.config';
import { inject, injectable }     from "inversify";
import { Logger }                 from '@cli/cli.logger';
import { Channels }               from '@pubsub-lib/pubsub-channels';
import { IPubsubMessage }         from '@pubsub-lib/pubsub-message';
import { IPubsubPayload}          from '@pubsub-lib/pubsub-message';
import { PubsubPayload }          from '@pubsub-lib/pubsub-message';
import { ServiceType }            from '@pubsub-lib/pubsub-types';
import { ServiceRegistry }        from '@pubsub/service-registry';
import { PubsubCore }             from '@pubsub-lib/pubsub-core';
import {KInt} from '@root/kernel-interfaces';

export interface IPubsubApp {
	initApp(): void;
}

@injectable()
export class PubsubApp implements IPubsubApp {
	constructor(
		@inject(KInt.IPubsubCore) private pubsubCore: PubsubCore,
		@inject(KInt.IServiceRegistry) private serviceRegistry: ServiceRegistry
	) {}

	public initApp() {

		let channels = [
			Channels.ServiceChannel,
			Channels.ServiceHello
		];

		this.pubsubCore.subscribe(channels);

		this.pubsubCore.onServiceHello((msg) => {
			this.serviceHello(msg);
		});

		this.pubsubCore.onServiceMessage((msg) => {
			this.handleServiceMessage(msg);
		});

		this.requestPingBack();
	}

	/**
	 * A Server Hello have been received
	 * @param {IPubsubPayload} payload
	 */
	private serviceHello(payload: any) {
		console.log("******** SERVICE HELLO ::", payload);
		if (payload && payload.type === ServiceType.VendorPriceService) {
			Logger.logYellow("*** .VendorPriceService ::", payload);
			this.serviceRegistry.registerService(payload);
		}
	}

	private handleServiceMessage(msg: IPubsubMessage) {
		Logger.logPurple("*** handleServiceMessage ::", msg);
	}

	// Ping Services
	// Request all services to phone home
	public requestPingBack(): void {
		let payload = new PubsubPayload(ServiceType.VendorPriceService, {});

		this.pubsubCore.publish(Channels.RequestHello, payload).then(res => {
			Logger.logPurple("requestPingBack ::", res);
		}).catch(err => {
			Logger.logError("requestPingBack :: err ::", err);
		});
	}
}
