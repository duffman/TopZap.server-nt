/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { IDroneModule }           from "@pubsub/zapdrone-service/drone-module";
import { ScaledroneClient }       from "@pubsub/scaledrone-service/scaledrone-client";

export interface IDroneFactory {
	createDrone(channelId: string): IDroneModule;
}

export class DroneFactory implements IDroneFactory {
	constructor() {}

	public createDrone(channelId: string): IDroneModule {
		let drone = new ScaledroneClient(channelId);

		return drone;
	}
}
