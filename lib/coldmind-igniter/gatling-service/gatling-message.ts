/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IGatlingPacket {
	seq: number;
	data?: any;
}

export class IGatlingMessage {
	host: string;
	port: number;
	data: string;
}

export class GatlingMessage implements IGatlingMessage {
	constructor(public host: string,
				public port: number,
				public data: any = null) {

		if (data === null) {
			data = "";
		} else {
			data = JSON.stringify(data);
		}
	};
}