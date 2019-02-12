/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone            from 'scaledrone-node';
import { Request }                from 'express';
import { Response }               from 'express';
import { Router }                 from 'express';
import { IApiController }         from '@api/api-controller';
import { Logger }                 from '@cli/cli.logger';
import { ISessionBasket }         from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import { IChannelMessage }        from '@channels/channel-message';
import { ChannelMessage }         from '@channels/channel-message';
import {ChannelConfig, MessagePipes} from '@channels/channel-config';
import { ChannelNames }           from '@channels/channel-config';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { Channel }                from '@channels/channel';
import { ApiControllerUtils }     from '@api/controller.utils';
import { BasketService }          from '@app/services/basket.service';
import { VendorOfferData }        from '@zapModels/zap-offer.model';
import { ChannelEvents }          from '@channels/channel-events';
import { AnalyticsDb }            from '@db/analytics-db';
import { ApiRoutes }              from '@api/api-routes';
import {DroneCore} from '@channels/drone-core';

export class BidsApiController implements IApiController{
	debugMode: boolean;
	basketService: BasketService;
	analyticsDb: AnalyticsDb;

	drone: any;
	channel: any;

	constructor() {
		this.analyticsDb = new AnalyticsDb();

		console.log("BidsApiController --- XXX");
		this.basketService = new BasketService();
		//super(ChannelNames.Bids, MessagePipes.NewBid);

		this.drone = new Scaledrone("0RgtaE9UstNGjTmu");
		this.channel = this.drone.subscribe(MessagePipes.GetBid);

		 this.channel.on(ChannelEvents.ChannelData, data => {
			console.log("XXX DATA ::", data);
		});

		// -- //

		this.channel = new Channel(ChannelNames.Bids, MessagePipes.NewBid);
		this.channel.onChannelData((data) => {
			let sessId = data.sessId;

			console.log("NEW BID RECEIVED ::", data);

			if (data.type === ZapMessageType.VendorOffer) {
				this.onNewVendorBid(data);
			} else {
				this.basketService.getReviewData(sessId).then(data => {
					console.log("DATA ::", data);
				});
			}
		});
	}

	public onNewVendorBid(message: IChannelMessage) {
		let vendorBid = message.data;
		this.basketService.addToBasket(message.sessId, message.data).then(res => {
			let tmpDrone = new DroneCore(ChannelConfig.getChannelId(ChannelNames.Basket));
			tmpDrone.emitRaw("A405CP", { type: "getBasket"});

		}).catch(err => {
			console.log("onNewVendorBid :: error ::", err);
		});
		console.log("onNewVendorBid :: -->");
	}

	private apiGetBasket(req: Request, resp: Response): void {
		console.log("apiGetBasket ::", req.sessionID);

		this.basketService.getCurrentBasket(req.sessionID).then(data => {
			resp.json(data);

		}).catch(err => {
			Logger.logError("apiGetBasket :: err ::", err);
		});
	}

	private apiAddBasketItem(req: Request, resp: Response): void {
		let data = req.body;
		let code = data.code;

		console.log("BIDS :: CODE ::", code);

		let res = this.doGetBids(code, req.sessionID);
		ApiControllerUtils.jsonSuccess(resp, res);
	}

	private apiDeleteBasketItem(req: Request, resp: Response): void {
	}

	private apiReviewBasket(req: Request, resp: Response): void {
		let data = req.body;

		console.log("BASKET :: SESSION ID ::", req.sessionID);
	}

	public initRoutes(routes: Router): void {
		routes.all("/basketa", (req, resp) => {
			resp.end("Balle");
		});

		routes.post(ApiRoutes.Basket.GET_BASKET,            this.apiGetBasket.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_ADD,       this.apiAddBasketItem.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_DELETE,    this.apiDeleteBasketItem.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_REVIEW,    this.apiReviewBasket.bind(this));
	}

	public doGetBids(code: string, sessId: string): boolean {
		let result: boolean = true;

		try {
			Logger.log(`BasketChannelController :: doGetOffers`);

			/*
			let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: code}, sessId);
			this.emitMessage(messData, MessagePipes.GetBid);
			Logger.logPurple("doGetBids :: CHANNEL-DATA ::", messData);
			*/

			let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: code}, sessId);
			console.log("BidsApiController :: Emitting ::", messData);
			this.channel.emitMessage(messData, MessagePipes.GetBid);

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

	public getSessionBasket(sessId: string): ISessionBasket {
		//let sessBasket = this.basketSessService.getSessionBasket(sessId);

		let sessBasket = new SessionBasket();
		return sessBasket;
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