/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export module ZapMessageType {
	export const GetOffers        = 'getOffers';
	export const GetOffersInit    = 'getOffersInit';
	export const VendorOffer      =  'vendorOffer';
	export const GetOffersDone    = 'getOffersDone';

	export const GCaptchaVerify   = 'gcapV';

	export const GetVendors       = 'getVendors';
	export const VendorsList      = 'vendorsList';

	//
	// Error Types
	//
	export const ErrInvalidCode   = 'invalidCode';


	//
	// Basket Messages
	//
	export const BasketGet        = 'basketGet';
	export const BasketAdd        = 'basketAdd';
	export const BasketRem        = 'basketRem';
	export const BasketRemRes     = 'basketRemRes';
	export const BasketPull       = 'basketPull';

	export const BasketAddRes     = 'basketAddResult';
}
