/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IDroneChannelConfig {
	channels: IDroneChannel[];
}

export interface IDroneChannel {
	name: string;
	channelID: string;
	secretKey: string;
}

export class DroneChanneConfig implements IDroneChannelConfig {
	constructor(public channels: IDroneChannel[]) {}
}

export class DroneChannel implements IDroneChannel{
	constructor(public name: string,
				public channelID: string,
				public secretKey: string) {}
}

export namespace DroneChannelConvert {
	export function toIChannelConfig(json: string): IDroneChannelConfig {
		return JSON.parse(json);
	}

	export function iChannelConfigToJson(value: IDroneChannelConfig): string {
		return JSON.stringify(value);
	}
}
