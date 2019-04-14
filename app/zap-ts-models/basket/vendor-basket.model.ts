/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IBasketModel }           from './basket.model';
import { BasketModel }            from './basket.model';
import { IVendorModel }           from '../vendor-model';

//
// NOTE: it extends IBasketModel and get items from the super class!!
//
export interface IVendorBasket extends IBasketModel {
	vendorId: number;
	vendorData: IVendorModel;
	highestBidder: boolean;
}

export class VendorBasketModel extends BasketModel implements IBasketModel {
	vendorData: IVendorModel;
	highestBidder: boolean;

	constructor(public vendorId: number) {
		super();
	}
}
