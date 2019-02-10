/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

export interface IVendorModel {
	id: number;
	identifier: string;
	vendorType: string;
	name: string;
	description: string;
	websiteUrl: string;
	logoName: string;
	color: string;
	textColor: string;
	colorHighlight: string;
}

export class Vendor implements IVendorModel {
	constructor(
		public id: number,
		public identifier: string,
		public vendorType: string,
		public name: string,
		public description: string,
		public websiteUrl: string,
		public logoName: string,
		public color: string = "",
		public textColor: string = "",
		public colorHighlight: string = "") {}
}
