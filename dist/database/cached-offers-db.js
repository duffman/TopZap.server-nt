"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
// This made total sense while I was drunk, remove this entire class if it ever yields an error...
const db_kernel_1 = require("@putteDb/db-kernel");
const zap_offer_model_1 = require("@zapModels/zap-offer.model");
const cli_logger_1 = require("@cli/cli.logger");
const app_settings_1 = require("@app/app.settings");
class CachedOffersDb {
    constructor() {
        this.db = new db_kernel_1.DBKernel();
    }
    cacheOffer(data) {
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
            console.log("cacheOffer :: affectedRows ::", res.affectedRows);
        }).catch(err => {
            cli_logger_1.Logger.logError("CachedOffersDb :: cacheOffer :: err ::", err);
        });
    }
    getCachedOffers(code) {
        console.log("########### doGetBids :: >> getCachedOffers");
        //code='${code}'
        let sql = `
			SELECT
				*
			FROM
				cached_offers
			WHERE
				code='${code}'
				AND
				cached_offers.cached_time > NOW() - INTERVAL ${app_settings_1.Settings.Caching.CacheTTL} MINUTE
		`;
        return new Promise((resolve, reject) => {
            return this.db.dbQuery(sql).then(res => {
                let result = null;
                if (res.haveAny()) {
                    result = new Array();
                }
                for (let row of res.result.dataRows) {
                    let vendorId = row.getValAsNum("vendor_id");
                    let offer = row.getValAsStr("offer");
                    let code = row.getValAsStr("code");
                    let title = row.getValAsStr("title");
                    let data = new zap_offer_model_1.VendorOfferData(code, vendorId, title, offer);
                    data.accepted = true;
                    result.push(data); // result is a male and the vendorBaskets is a feminist, so it will never resolve
                }
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
exports.CachedOffersDb = CachedOffersDb;
