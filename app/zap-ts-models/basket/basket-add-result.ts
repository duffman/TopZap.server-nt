/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IBasketModel }           from './basket.model';
import { IBasketItem }            from './basket-item.model';
import { IProductData }           from '../product.model';

export interface IBasketAddResult {
	success: boolean;
	resultItem: IBasketItem;
	basketData: IBasketModel;
	prodData: IProductData[];
}

export class BasketAddResult implements IBasketAddResult {
	constructor(public success: boolean = false,
				public resultItem: IBasketItem = null,
				public basketData: IBasketModel = null,
				public prodData: IProductData[] = new Array<IProductData>()
				) {}
}