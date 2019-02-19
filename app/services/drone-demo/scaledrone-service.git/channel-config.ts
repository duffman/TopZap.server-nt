/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IDroneChannel }          from './channel-info';

export class ChannelNames {
	public static Basket = "Basket";
	public static Bids = "Bids";
	public static Service = "Service";
}

export class MessagePipes {
	public static GetBid = "getBid";
	public static GetReview = "getReview";
	public static GetBestBasket = "getBest";
	public static NewBid = "newBid";
	public static Service = "service";
}

const ChannelDef = [
	{ name: ChannelNames.Basket, channelID: "wnQpxZuJgaUChUul", secretKey: "z2EWz4zXdNr63YUiwavv5kpdahRYfXxC"},
	{ name: ChannelNames.Bids, channelID: "0RgtaE9UstNGjTmu", secretKey: "Q8ZcaFTMQTReingz9zNJmKjuVgnVYvYe"},
	{ name: ChannelNames.Basket, channelID: "T4eUrfAVDy7ODb0h", secretKey: "RyoF4UUVHCw6jEU1JtscfhNGaGsJrgF7"},
];

export class ChannelConfig {
	constructor() {}

	public static getDroneChannel(name: string): IDroneChannel {
		let result: IDroneChannel;

		for (const channel of ChannelDef) {
			if (channel.name === name) {
				result = channel;
				break;
			}
		}

		return result;
	}

	public static getChannelId(name: string): string {
		let channelDef = ChannelConfig.getDroneChannel(name);
		if (channelDef) {
			return channelDef.channelID;
		} else {
			return null;
		}
	}
}
