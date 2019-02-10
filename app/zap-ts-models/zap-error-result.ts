/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IZapErrorResult {
	code?:    number;
	message?: string;
}

export class ZapErrorResult implements IZapErrorResult {
	constructor(public code: number,
				public message: string) {}
}

export namespace ErrorConvert {
	export function toZapError(json: string): IZapErrorResult {
		return JSON.parse(json);
	}

	export function zapErrorToJson(value: IZapErrorResult): string {
		return JSON.stringify(value);
	}
}

export function GetZapError(data: any): IZapErrorResult {
	let result: IZapErrorResult = null;
	if (data === null) {
		return result;
	}

	let strRep = JSON.stringify(data);
	return ErrorConvert.toZapError(strRep);
}
