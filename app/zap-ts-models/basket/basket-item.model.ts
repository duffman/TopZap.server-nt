/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IBasketItem {
	zid:            string;
	itemType:       number
	code:           string;
	vendorId:       number;
	title:          string;
	offer:          number;
	publisher:      string;
	releaseDate:    string;
	thumbImage:     string;
	platformIcon?:  string;
	count:          number;
}

export class BasketItem implements IBasketItem {
	constructor(public zid: string,
				public itemType: number,
				public code: string = null,
				public vendorId: number = null,
				public title: string = null,
				public offer: number = null,
				public publisher: string = null,
				public releaseDate: string = null,
				public thumbImage: string = null,
				public platformIcon: string = null,
				public count: number = 1) {}
}
