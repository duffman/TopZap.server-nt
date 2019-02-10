/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

export class ProductBidModel {
	constructor(
		public id: string,
		public vendorId: string,
		public productId: string,
		public barcode: string,
		public buy_price: string,
		public sell_price: string
	) {}
}