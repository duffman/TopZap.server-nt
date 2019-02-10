/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IChannelMessage {
	type: string;
	action: string;
	data: any;
	sessId: string;
	tag: string;
}

export class ChannelMessage implements IChannelMessage {
	constructor(public type: string,
				public action: string,
				public data: any = null,
				public sessId: string = "",
				public tag: string = null) {}
}
