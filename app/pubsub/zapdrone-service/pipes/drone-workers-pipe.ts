/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { injectable }             from "inversify";
import * as Scaledrone            from 'scaledrone-node';
import { IDroneServicePipe }      from "@app/pubsub/zapdrone-service/pipes/drone-service-pipe";
import { ChannelNames }           from "@app/pubsub/scaledrone-service/channel-config";
import { MessagePipes}            from "@app/pubsub/scaledrone-service/channel-config";
import { ScaledroneClient }       from "@app/pubsub/scaledrone-service/scaledrone-client";
import { DroneEvents }            from '@scaledrone/drone-events';
import { BasketService }          from '@app/services/basket.service';

export interface IDroneWorkersPipe extends IDroneServicePipe {
}

@injectable()
export class DroneWorkersPipe implements IDroneWorkersPipe {
	workersDrone: ScaledroneClient;
	basketDrone: ScaledroneClient;

	channel: any;
	basketService: BasketService;

	constructor() {
	}

	public startService(): Promise<boolean> {
		this.workersDrone = new ScaledroneClient(ChannelNames.Service);
		this.channel = this.workersDrone.subscribe("register"); // <- suscribe on service client

		return new Promise((resolve, reject) => {
			this.channel.on(DroneEvents.Open, error => {
				if (error) {
					reject(false);
				} else {
					resolve(true);
				}
			});

			this.channel.on(DroneEvents.Data, data => {
				console.log("SERVICE REGISTER ::", data);
			});
		});
	}
}
