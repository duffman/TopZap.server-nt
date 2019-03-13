/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import "reflect-metadata";
import { inject, injectable }     from "inversify";
import { Interface }              from '@root/kernel.config';
import { BasketService }          from '@app/services/basket.service';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { IPubsubController }      from '@pubsub/pubsub.controller';
import { PubsubService }          from '@pubsub-lib/pubsub-service';
import {IPubsubMessage, PubsubMessage} from '@pubsub-lib/pubsub-message';
import { PublishResponse }        from 'pubnub';
import { Channels }               from '@pubsub-lib/publub-channels';
import { Logger }                 from '@cli/cli.logger';

@injectable()
export class BidsPubsub implements IPubsubController {
	pubsubService: PubsubService;
	basketService: BasketService;

	constructor(
		//@inject(Interface.BasketService) private basketService: BasketService,
	) {
		this.pubsubService = new PubsubService();
		this.pubsubService.subscribe([Channels.NewBidChannel]);
		this.basketService = new BasketService();

		this.pubsubService.onNewBidMessage((msg) => {
			this.onNewVendorBid(msg);
		});
	}

	/**
	 * Call the Pubsub Service to pass on Get bid messages to connected vendor clients
	 * @param {string} code
	 * @param {string} sessionId
	 */
	public getBid(code: string, sessionId: string): Promise<PublishResponse> {
		let message = new PubsubMessage(ZapMessageType.GetOffers, {code: code}, sessionId);
		return this.pubsubService.emitGetBidRequest(code, sessionId);
	}

	public onNewVendorBid(message: IPubsubMessage) {
		let vendorBid = message.data;

		console.log("onNewVendorBid ::", message);
		console.log("onNewVendorBid :: data ::", message.data);

		this.basketService.addToBasket(message.sessId, vendorBid.data).then(res => {

			this.pubsubService.emitGetBestBasketMessage(message.sessId).then(res => {
				Logger.logYellow("¤¤¤¤¤¤ emitGetBestBasketMessage :: sessId ::", message.sessId);
			}).catch(err => {
				Logger.logError("¤¤¤¤¤¤ emitGetBestBasketMessage :: err ::", err);
			});

		}).catch(err => {
			console.log("onNewVendorBid :: error ::", err);
		});
	}
}
