/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IVendorBasket }          from '../basket/vendor-basket.model';
import { IProductData }           from '../product.model';
import { IVendorModel }           from '../vendor-model';

export interface ISessionPullResult {
	success: boolean;
	productData: IProductData[];
	vendorData: IVendorModel[];
	data: IVendorBasket[];
}

export class SessionPullResult implements ISessionPullResult {
	constructor(public success: boolean = false,
				public productData: IProductData[] = null,
				public vendorData: IVendorModel[] = null,
				public data: IVendorBasket[] = new Array<IVendorBasket>()
	) {}
}