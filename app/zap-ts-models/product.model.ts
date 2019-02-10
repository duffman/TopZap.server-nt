/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IProductData {
	id:            number;
	code:          string;
	title:         string;
}

export class ProductData implements IProductData {
	constructor(public id: number = -1,
				public code: string = '',
				public title: string = ''
				) {
	}
}

export namespace Convert {
	export function toProductData(json: string): IProductData {
		return JSON.parse(json);
	}

	export function productDataToJson(value: IProductData): string {
		return JSON.stringify(value);
	}
}
