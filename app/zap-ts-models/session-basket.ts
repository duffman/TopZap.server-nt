/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IProductData }           from './product.model';
import { IVendorModel }           from './vendor-model';
import { IVendorBasket }          from './basket/vendor-basket.model';

export interface ISessionFlash {
	addItemName: string;
	addItemSuccess: boolean;
}

export class SessionFlash {
	constructor(public addItemName: string = "",
				public addItemSuccess: boolean = false) {}
}

export interface ISessionBasketInfo {
	itemsAccepted: number;
	itemsRejected: number;
}

export class SessionBasketInfo implements ISessionBasketInfo {
	constructor(public itemsAccepted: number = 0,
				public itemsRejected: number = 0) {}
}

//
// TODO:
// MOVE TO SEPARATE FILE
//
export interface IProdListItem {
	code: string;
	name: string;
}


export class ProdListItem implements IProdListItem {
	constructor(public code: string,
				public name: string) {}
}

//
//
//

export interface ISessionBasket {
	allItems: ProdListItem[];
	productData: IProductData[];
	vendorBaskets: IVendorBasket[];
	info: ISessionBasketInfo;
	flash: ISessionFlash;
}

export class SessionBasket implements ISessionBasket {
	constructor(public allItems: ProdListItem[] = new Array<ProdListItem>(),
				public productData: IProductData[] = new Array<IProductData>(),
				public vendorBaskets: IVendorBasket[] = new Array<IVendorBasket>(),
				public info: ISessionBasketInfo = new SessionBasketInfo(),
				public flash: ISessionFlash = new SessionFlash()
	) {}
}
