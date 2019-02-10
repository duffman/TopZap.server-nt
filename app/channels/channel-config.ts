/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {DroneChannel, IDroneChannel, IDroneChannelConfig} from '@app/channels/channel';

export enum ChannelNames {
	Basket = "Basket",
	BidsDemo = "BidsDemo",
	Service = "Service"
}

export class ChannelConfig {
	channels: IDroneChannel[];

	constructor() {
		this.channels = new Array<IDroneChannel>();

		this.channels.push(
			new DroneChannel(ChannelNames.Basket, "wnQpxZuJgaUChUul", "z2EWz4zXdNr63YUiwavv5kpdahRYfXxC")
		);

		this.channels.push(
			new DroneChannel(ChannelNames.BidsDemo, "0RgtaE9UstNGjTmu", "Q8ZcaFTMQTReingz9zNJmKjuVgnVYvYe")
		);

		this.channels.push(
			new DroneChannel(ChannelNames.Service, "T4eUrfAVDy7ODb0h", "RyoF4UUVHCw6jEU1JtscfhNGaGsJrgF7")
		);
	}

	public getChannelData(name: string): IDroneChannel {
		let result: IDroneChannel;

		for (const channel of this.channels) {
			if (channel.name === name) {
				result = channel;
				break;
			}
		}

		return result;
	}
}
