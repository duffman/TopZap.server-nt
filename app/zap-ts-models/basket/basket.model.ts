/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IBasketItem }            from "./basket-item.model";
import { IVendorModel }           from '../vendor-model';

export interface IBasketModel {
	items: IBasketItem[];
	totalValue: number;
}

export class BasketModel implements IBasketModel {
	constructor(public items = new Array<IBasketItem>(),
				public totalValue = 0) {
	}
}
