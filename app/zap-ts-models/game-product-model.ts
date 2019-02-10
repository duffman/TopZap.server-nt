/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IProductData } from "./product.model";

export interface IGameProductData extends IProductData {
	platformName?:  string;
	publisher?:     string;
	developer?:     string;
	genre?:         string;
	coverImage?:    string;
	thumbImage?:    string;
	videoSource?:   string;
	source?:        string;
	releaseDate?:   string;
	platformIcon?:  string;
	platformImage?: string;

	id:            number;
	code:          string;
}

export class GameProductData implements IGameProductData {
	constructor(
		public id:            number = -1,
		public code:          string = '',
		public platformName:  string = '',
		public title:         string = '',
		public publisher:     string = '',
		public developer:     string = '',
		public genre:         string = '',
		public coverImage:    string = '',
		public thumbImage:    string = '',
		public videoSource:   string = '',
		public source:        string = '',
		public releaseDate:   string = '',
		public platformIcon:  string = '',
		public platformImage: string = '',
	) {}
}

export namespace Convert {
	export function toProductData(json: string): IProductData {
		return JSON.parse(json);
	}

	export function productDataToJson(value: IProductData): string {
		return JSON.stringify(value);
	}
}
