/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

// This made total sense while I was drunk, remove this entire class if it ever yields an error...

import { DbManager }              from '@putteDb/db-kernel';
import { IVendorOfferData }       from '@zapModels/zap-offer.model';
import { VendorOfferData }        from '@zapModels/zap-offer.model';
import { Logger }                 from '@cli/cli.logger';
import { Settings }               from '@app/zappy.app.settings';
import { IDbController }          from '@db/db.controller';

export class CachedOffersDb implements IDbController {
	db: DbManager;

	constructor() {
		this.db = new DbManager();
	}

	public cacheOffer(data: IVendorOfferData): void {
		let sql = `INSERT INTO cached_offers (
					id,
					code,
					vendor_id,
					title,
					offer,
					cached_time
				) VALUES (
					NULL,
					'${data.code}',
					'${data.vendorId}',
					'${data.title}',
					'${data.offer}',
					CURRENT_TIMESTAMP
				)`;

		console.log("SQL ::", sql);

		this.db.dbQuery(sql).then(res => {
			// This is a fire and forget thing, I really had to write that, you SHALL NOT leave a class without comments
			// and you shall NOT leave your mastercard in the card machine at your local pub!!!
			console.log("cacheOffer :: affectedRows ::", res.affectedRows)
		}).catch(err => {
			Logger.logError("CachedOffersDb :: cacheOffer :: err ::", err);
		});
	}

	public getCachedOffers(code: string): Promise<IVendorOfferData[]> {
		console.log("########### doGetOffers :: >> getCachedOffers");

		//code='${code}'
		let sql = `
			SELECT
				*
			FROM
				cached_offers
			WHERE
				code='${code}'
				AND
				cached_offers.cached_time > NOW() - INTERVAL ${Settings.Caching.CacheTTL} MINUTE
		`;

		return new Promise((resolve, reject) => {
			return this.db.dbQuery(sql).then(res => {
				let result: IVendorOfferData[] = null;

				if (res.haveAny()) {
					result = new Array<IVendorOfferData>();
				}

				for (let row of res.result.dataRows) {
					let vendorId = row.getValAsNum("vendor_id");
					let offer = row.getValAsStr("offer");
					let code = row.getValAsStr("code");
					let title = row.getValAsStr("title");

					let data = 	new VendorOfferData(vendorId, title, offer);
					data.accepted = true;
					data.code = code;

					result.push(data); // result is a male and the data is a feminist, so it will never resolve
				}

				resolve(result);

			}).catch(err => {
				reject(err);
			});
		});
	}
}
