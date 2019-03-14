/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IZapOfferResult {
	highOffer: number;
	vendors:   IVendorOfferData[];
}

export interface IVendorOffer {
	code: string,
	vendorId: number,
	title: string,
	offer: number,
	success: boolean,
	accepted: boolean,
	thumbImg: string,
	rawData: any,
}

/*
export interface IVendorOfferData {
	success: boolean;
	vendorId: number;
	accepted: boolean;
	title: string;
	code?: string;
	offer: string;
	thumbImg: string;
	rawData:  any;
}
*/

export interface IVendorOfferData {
	vendorId: number;
	accepted: boolean;
	title: string;
	code?: string;
	offer: string;
	rawData:  any;
}

export class VendorOfferData implements IVendorOfferData {
	public accepted: boolean = true;
	public rawData: any = null;

	constructor(public code: string,
				public vendorId: number,
				public title: string,
				public offer: string) {}
}


// Converts JSON strings to/from your types
export namespace ZapOfferResult {
	export function toZapRes(json: string): IZapOfferResult {
		return JSON.parse(json);
	}

	export function zapResToJson(value: IZapOfferResult): string {
		return JSON.stringify(value);
	}
}
