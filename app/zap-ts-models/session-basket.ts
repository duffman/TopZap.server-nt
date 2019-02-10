/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IProductData }           from './product.model';
import { IVendorModel }           from './vendor-model';
import { IVendorBasket }          from './basket/vendor-basket.model';

export interface ISessionBasket {
	productData: IProductData[];
	data: IVendorBasket[];
}

export class SessionBasket implements ISessionBasket {
	constructor(public productData: IProductData[] = new Array<IProductData>(),
				public data: IVendorBasket[] = new Array<IVendorBasket>()
	) {}
}
