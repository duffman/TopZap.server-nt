/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IChannelMessage {
	type: string;
	data: any;
	sessId: string;
	success: boolean;
	tag: string;
}

export class DroneMessage implements IChannelMessage {
	constructor(public type: string,
				public data: any = null,
				public sessId: string = "",
				public success: boolean = true,
				public tag: string = null) {}
}
