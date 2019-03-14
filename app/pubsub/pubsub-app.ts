/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { Interface, kernel, Tag } from '@root/kernel.config';
import { inject, injectable }     from "inversify";
import { PubsubService }          from '@pubsub-lib/pubsub-service';
import { Logger }                 from '@cli/cli.logger';
import { Channels }               from '@pubsub-lib/pubsub-channels';
import { IPubsubMessage }         from '@pubsub-lib/pubsub-message';
import { IPubsubPayload}          from '@pubsub-lib/pubsub-message';
import { PubsubPayload }          from '@pubsub-lib/pubsub-message';
import { ServiceType }            from '@pubsub-lib/pubsub-types';

export interface IPubsubApp {
	initApp(): void;
}

@injectable()
export class PubsubApp implements IPubsubApp {
	constructor(
		@inject("IPubsubService") private pubsubService: PubsubService
	) {}

	public initApp() {
		this.pubsubService.subscribe([Channels.ServiceChannel]);

		this.pubsubService.onServiceHello((msg) => {
			this.serviceHello(msg);
		});

		this.pubsubService.onServiceMessage((msg) => {
			this.handleServiceMessage(msg);
		});

		this.requestPingBack();
	}

	private serviceHello(payload: IPubsubPayload) {
		if (payload.type === ServiceType.VendorPriceService) {
			Logger.logYellow("*** .VendorPriceService ::", payload);
		}
	}

	private handleServiceMessage(msg: IPubsubMessage) {
		Logger.logPurple("*** handleServiceMessage ::", msg);
	}

	// Ping Services
	// Request all services to phone home
	public requestPingBack(): void {
		let payload = new PubsubPayload(ServiceType.VendorPriceService, {});

		this.pubsubService.publish(Channels.RequestHello, payload).then(res => {
			Logger.logPurple("requestPingBack ::", res);
		}).catch(err => {
			Logger.logError("requestPingBack :: err ::", err);
		});
	}
}
