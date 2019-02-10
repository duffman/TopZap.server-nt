/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IZapResult {
	success: boolean;
	error: any;
}

export class ZapResult implements IZapResult {
	constructor(public success: boolean = false,
				public error: any = null) {}
}

