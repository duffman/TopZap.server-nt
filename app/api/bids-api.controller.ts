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
import { DroneBidsPipe }          from '@zapdrone/pipes/drone-bids-pipe';

@injectable()
export class BidsApiController implements IRestApiController{
	debugMode: boolean;
	bidsPipe: DroneBidsPipe;
	analyticsDb: AnalyticsDb;

	drone: any;
	channel: any;

	constructor(
		@inject("IBasketService") private basketService: BasketService,
		@inject("IDroneBidsPipe") private droneBidsPipe: DroneBidsPipe
	) {
		this.analyticsDb = new AnalyticsDb(); //TODO: INJECT INSTEAD

		console.log("BidsApiController --- XXX");

		droneBidsPipe.startService(true);
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
			//this.bidsPipe.getBid(code, sessId);
			this.droneBidsPipe.getBid(code, sessId);

			//let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: code}, sessId);

			/*
			let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: code}, sessId);
			this.emitMessage(messData, MessagePipes.GetBid);
			Logger.logPurple("doGetBids :: CHANNEL-DATA ::", messData);
			*/

			/* RE-ADD THIS
			let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: code}, sessId);
			console.log("BidsApiController :: Emitting ::", messData);
			this.channel.emitMessage(messData, MessagePipes.GetBid);
			*/

			/*
			this.bidsDrone.publish(
				{room: MessagePipes.GetBid, message: messData }
			);
			*/

		}
		catch (err) {
			Logger.logError("doGetBids :: ERROR ::", err);
			result = false;
		}

		return result;
	}
}
