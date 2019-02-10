/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ISessionBasket }         from '@zapModels/session-basket';
import { Logger }                 from '@cli/cli.logger';
import { IVendorBasket }          from '@zapModels/basket/vendor-basket.model';

import { inspect } from 'util' // or directly

export class BasketUtils {
	/**
	 * Log a session basket
	 * @param {ISessionBasket} basket
	 * @param {boolean} includeVendorData
	 */
	public static showBasket(basket: ISessionBasket, includeVendorData: boolean = true): void {
		Logger.logPurple("## showBasket ##");
		if (!basket.data) {
			Logger.logYellow("showBasket :: Vendor Baskets is NULL");
			return;
		}

		for (const vBasket of basket.data) {
			let vendorBasket: IVendorBasket = vBasket;

			if (!vendorBasket) {
				Logger.logYellow("showBasket :: The Baskets is NULL");
				continue;
			}

			Logger.logYellow("showBasket :: vendorId ::", vendorBasket.vendorId);
		//	Logger.logYellow("showBasket :: highestBidder ::", vendorBasket.highestBidder);
			if (includeVendorData) {
				if (vendorBasket.vendorData) {
					Logger.logYellow("showBasket :: vendorBasket.vendorData ::", JSON.stringify(vendorBasket.vendorData))
					Logger.logYellow("showBasket :: id", (vendorBasket.vendorData.id) ? vendorBasket.vendorData.id : "vendorBasket.vendorData.id = undefined");
					Logger.logYellow("showBasket :: identifier", (vendorBasket.vendorData.identifier) ? vendorBasket.vendorData.identifier : "vendorBasket.vendorData.identifier = undefined");
					Logger.logYellow("showBasket :: vendorType", (vendorBasket.vendorData.vendorType) ? vendorBasket.vendorData.vendorType : "vendorBasket.vendorData.vendorType = undefined");
					Logger.logYellow("showBasket :: name", (vendorBasket.vendorData.name) ? vendorBasket.vendorData.name : "vendorBasket.vendorData.name = undefined");
				} else {
					Logger.logError("vendorBasket.vendorData :: MISSING");
				}
			}

			if (!vendorBasket.items) {
				Logger.logYellow("showBasket :: The Baskets HAVE NO ITEMS");
				continue;
			}

			for (const basket of vendorBasket.items) {
				Logger.logPurple("showBasket :: ITEM :: basket.vendorId ::", (basket.vendorId) ? basket.vendorId : "basket.vendorId = undefined");
				Logger.logPurple("showBasket :: ITEM :: basket.code ::", (basket.code) ? basket.code : "basket.code = undefined");
				Logger.logPurple("showBasket :: ITEM :: basket.offer ::", (basket.offer) ? basket.offer : "basket.offer = undefined");
				Logger.logPurple("showBasket :: ITEM :: basket.title ::", (basket.title) ? basket.title : "basket.title = undefined");
				Logger.logPurple("showBasket :: ITEM :: basket.thumbImage ::", (basket.thumbImage) ? basket.thumbImage : "basket.thumbImage = undefined");
			}
		}
	}
}
