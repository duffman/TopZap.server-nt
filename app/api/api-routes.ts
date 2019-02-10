/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export module ApiRoutes {
	export module Basket {
		export const GET_BASKET             = "/basket";
		export const POST_BASKET_ADD        = "/basket/add";
		export const POST_BASKET_DELETE     = "/basket/del";
		export const POST_BASKET_CLEAR      = "/basket/clear";
		export const POST_BASKET_REVIEW     = "/basket/review";
		export const POST_BASKET_SESS_PULL  = "/basket/pull";
	}
}
