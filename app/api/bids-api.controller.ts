/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Request }                from 'express';
import { Response }               from 'express';
import { Router }                 from 'express';
import { IApiController }         from '@api/api-controller';
import { Logger }                 from '@cli/cli.logger';
import { ISessionBasket }         from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import { RestUtils }              from '@api/../utils/rest-utils';
import { BasketService }          from '@app/services/basket.service';
import { AnalyticsDb }            from '@db/analytics-db';
import { ApiRoutes }              from '@app/settings/api-routes';
import { ServiceBidsPipe }        from '@zapdrone/pipes/drone-bids-pipe';

export class BidsApiController implements IApiController{
	debugMode: boolean;
	basketService: BasketService;
	bidsPipe: ServiceBidsPipe;
	analyticsDb: AnalyticsDb;

	drone: any;
	channel: any;

	constructor() {
		this.analyticsDb = new AnalyticsDb();

		console.log("BidsApiController --- XXX");
		this.basketService = new BasketService();
		this.bidsPipe = new ServiceBidsPipe();
	}

	private apiGetBasket(req: Request, resp: Response): void {
		console.log("apiGetBasket ::", req.session.id);

		this.basketService.getCurrentBasket(req.session.id).then(data => {
			resp.json(data);

		}).catch(err => {
			Logger.logError("apiGetBasket :: err ::", err);
		});
	}

	private apiAddBasketItem(req: Request, resp: Response): void {
		let data = req.body;
		let code = data.code;

		console.log("BIDS :: BODY ::", data);
		console.log("BIDS :: CODE ::", code);

		let res = this.doGetBids(code, req.session.id);
		RestUtils.jsonSuccess(resp, res);
	}

	private apiDeleteBasketItem(req: Request, resp: Response): void {
		let code = req.body.code;

		this.basketService.removeItem(code).then(res => {

		}).catch(err => {

		});
	}

	private apiReviewBasket(req: Request, resp: Response): void {
		let data = req.body;
		let sessId = req.session.id;

		console.log("BASKET :: SESSION ID ::", sessId);

		this.basketService.getReviewData(sessId).then(res => {
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
			this.bidsPipe.getBid(code, sessId);

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

/*
let test = new BidsApiController();

let jsonData = `{ "success": "true",
     "code": "0887195000424",
    "vendorId": 13,
     "accepted": true,
     "title": ,
     offer: '0.13',
     thumbImg: null,
     rawData: null };`;

//let data = JSON.parse(jsonData);


let vendorOffer = new VendorOfferData("0887195000424", 13, '845 Heroes: 98 Heroes Edition - Nintendo Switch', "0.13");

let cData = new ChannelMessage(ZapMessageType.VendorOffer, vendorOffer, 'KALLEKULA');

test.onNewVendorBid(cData);
*/