/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * December 2018
 */

import { AddressInfo } from "net";

export interface ISrvListenResult {
	success: boolean;
	portNumber: number;
	addressInfo: AddressInfo;
	error: any;
}

export class SrvListenResult implements ISrvListenResult {
	constructor(public success: boolean = false,
				public portNumber: number = -1,
				public addressInfo: any = null,
				public error: any = null) {}
}