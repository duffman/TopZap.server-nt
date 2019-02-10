/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { IBasketModel }           from './basket/basket.model';
import { BasketModel }            from './basket/basket.model';

export interface IZapBasketData {
	value: number;
	bids: number ;
	basket: IBasketModel;
}

export class ZapBasketData implements IZapBasketData {
	constructor(public value: number = 0,
				public bids: number = 0,
				public basket: IBasketModel = new BasketModel()) {}

}
