'use strict';Object.defineProperty(exports,'__esModule',{value:true});const db_kernel_1=require('../lib/dbcore/db-kernel');const zap_offer_model_1=require('../app/zap-ts-models/zap-offer.model');const cli_logger_1=require('../app/cli/cli.logger');const app_settings_1=require('../app/app.settings');class CachedOffersDb{constructor(){this.tableName='cached_offers';this.db=new db_kernel_1.DBKernel();}cacheOffer(data){let sql=`INSERT INTO  ${this.tableName} (
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
				)`;this.db.dbQuery(sql).then(res=>{console.log('cacheOffer :: affectedRows ::',res.affectedRows);}).catch(err=>{cli_logger_1.Logger.logError('CachedOffersDb :: cacheOffer :: err ::',err);});}getCachedOffers(code){console.log('########### doGetBids :: >> getCachedOffers');let sql=`
			SELECT
				*
			FROM
				cached_offers
			WHERE
				code='${code}'
				AND
				cached_offers.cached_time > NOW() - INTERVAL ${app_settings_1.Settings.Caching.CacheTTL} MINUTE
		`;return new Promise((resolve,reject)=>{return this.db.dbQuery(sql).then(res=>{let result=null;if(res.haveAny()){result=new Array();}for(let row of res.result.dataRows){let vendorId=row.getValAsNum('vendor_id');let offer=row.getValAsStr('offer');let code=row.getValAsStr('code');let title=row.getValAsStr('title');let data=new zap_offer_model_1.VendorOfferData(code,vendorId,title,offer);data.accepted=true;result.push(data);}resolve(result);}).catch(err=>{reject(err);});});}}exports.CachedOffersDb=CachedOffersDb;