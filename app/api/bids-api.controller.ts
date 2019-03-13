/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { inject, injectable }     from "inversify";
import { Interface }              from '@root/kernel.config';
import { Request }                from 'express';
import { Response }               from 'express';
import { Router }                 from 'express';
import { IRestApiController }     from '@api/api-controller';
import { Logger }                 from '@cli/cli.logger';
import { RestUtils }              from '@api/../utils/rest-utils';
import { BasketService }          from '@app/services/basket.service';
import { AnalyticsDb }            from '@db/analytics-db';
import { ApiRoutes }              from '@app/settings/api-routes';
import { BidsPubsub }             from '@pubsub/bids-pubsub';

@injectable()
export class BidsApiController implements IRestApiController{
	debugMode: boolean;
	analyticsDb: AnalyticsDb;

	constructor(
		@inject("IBasketService") private basketService: BasketService,
		@inject("IPubsubController") private bidsPubsub: BidsPubsub

	) {
		this.analyticsDb = new AnalyticsDb(); //TODO: INJECT INSTEAD
	}

	private apiGetBasket(req: Request, resp: Response): void {
		let data = req.body;
		let zsid = data.zsid;
		let sessId = req.session.id;

		console.log("apiGetBasket :: BODY ::", data);
		console.log("apiGetBasket :: ZSID ::", zsid);
		console.log("apiGetBasket :: sessId ::", sessId);

		this.basketService.getCurrentBasket(zsid).then(data => {
			resp.json(data);
		}).catch(err => {
			Logger.logError("apiGetBasket :: err ::", err);
		});
	}

	private apiAddBasketItem(req: Request, resp: Response): void {
		let data = req.body;
		let code = data.code;
		let zsid = data.zsid;

		console.log("BIDS :: BODY ::", data);
		console.log("BIDS :: ZSID ::", zsid);
		console.log("BIDS :: CODE ::", code);

		let res = this.doGetBids(code, zsid); // req.session.id
		RestUtils.jsonSuccess(resp, res);
	}

	private apiDeleteBasketItem(req: Request, resp: Response): void {
		let data = req.body;
		let code = data.code;
		let zsid = data.zsid;

		let sessId = req.session.id;

		console.log("REMOVING ITEM :: BODY ::", data);
		console.log("REMOVING ITEM :: ZSID ::", zsid);
		console.log("REMOVING ITEM :: CODE ::", code);

		this.basketService.removeItem(code, zsid).then(res => {
			RestUtils.jsonSuccess(resp, true);
		}).catch(err => {
			RestUtils.jsonError(resp);
		});
	}

	private apiReviewBasket(req: Request, resp: Response): void {
		let data = req.body;
		let zsid = data.zsid;
		let sessId = req.session.id;

		console.log("BASKET :: SESSION ID ::", sessId);
		console.log("BASKET :: ZSID ::", zsid);

		this.basketService.getReviewData(zsid).then(res => {
			console.log("apiReviewBasket ::", JSON.stringify(res));
			resp.json(res);

		}).catch(err => {
			Logger.logError("apiReviewBasket :: err ::", err);
		});
	}

	public initRoutes(routes: Router): void {
		routes.post(ApiRoutes.Basket.GET_BASKET,            this.apiGetBasket.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_ADD,       this.apiAddBasketItem.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_DELETE,    this.apiDeleteBasketItem.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_REVIEW,    this.apiReviewBasket.bind(this));
	}

	public doGetBids(code: string, sessId: string): boolean {
		let result: boolean = true;

		try {
			Logger.log(`BasketChannelController :: doGetOffers`);
			this.bidsPubsub.getBid(code, sessId).then(res => {
				Logger.logPurple("BidsApiController :: doGetBids :: " + code + " ::", sessId);
			}).catch(err => {
				Logger.logError("BidsApiController :: err ::", err);
			});
		}
		catch (err) {
			Logger.logError("doGetBids :: ERROR ::", err);
			result = false;
		}

		return result;
	}
}
