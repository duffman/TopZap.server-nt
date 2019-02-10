/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IZapResult }             from './zap-result';
import { IProductData }           from './product.model';

export interface IProductDataResult extends IZapResult {
	productData: IProductData;
}

export class ProductDataResult implements IProductDataResult {
	constructor(public success: boolean = false,
				public error: any = null,
				public productData: IProductData = null) {}
}
