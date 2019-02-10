/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import { ProductBidModel } from "@models/product-bid-model";

export class ProductBidList {
	list = Array<ProductBidModel>();

	constructor() {}

	public addBid(bid: ProductBidModel) {
		this.list.push(bid);
	}
}