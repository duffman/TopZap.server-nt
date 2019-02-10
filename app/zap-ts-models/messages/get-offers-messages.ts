/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IGetOffersInit {
	vendorCount: number;
}

export interface IGetOffersDone {
	success: boolean;
}

export class GetOffersDone implements IGetOffersDone {
	constructor(public success: boolean = false) {}
}

export class GetOffersInit implements IGetOffersInit {
	constructor(public vendorCount: number = 0) {}
}
