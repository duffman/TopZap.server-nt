/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IdGenerator }            from '../id-generator';
import { EventType }              from '@igniter/messaging/event-types';

export interface IBroadcastMessage {
	originHost: string;
	originPort: number;
	id: number;
}

export class BroadcastMessage implements IBroadcastMessage {
	public data: any = null;

	constructor(
		public originHost: string,
		public originPort: number,
		public id: number = -1) {

		if (id < 1) {
			id = IdGenerator.newId();
		}

		this.data = {
			type: EventType.Broadcast,
			action: EventType.Actions.Connect
		};
	}
}

export interface IDiscoveryMessData {
	host?: string;
	port?: number;
	data?: Payload;
}

export class DiscoveryMessData implements IDiscoveryMessData {
	constructor(public host?: string,
				public port?: number,
				public data?: Payload) {}
}


export interface Payload {
	type?:   string;
	action?: string;
}

// Converts JSON strings to/from your types
export namespace DataConvert {
	export function toDiscoveryMessData(json: string): DiscoveryMessData {
		return JSON.parse(json);
	}

	export function discoveryMessDataToJson(value: DiscoveryMessData): string {
		return JSON.stringify(value);
	}
}
