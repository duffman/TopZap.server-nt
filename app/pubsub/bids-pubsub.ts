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
import { IPubsubMessage }         from '@pubsub-lib/pubsub-message';
import { PubsubMessage}           from '@pubsub-lib/pubsub-message';
import { PublishResponse }        from 'pubnub';
import { Channels }               from '@pubsub-lib/pubsub-channels';
import { Logger }                 from '@cli/cli.logger';
import { IVendorOfferData }       from '@zapModels/zap-offer.model';
import { PubsubCore }             from '@pubsub-lib/pubsub-core';

@injectable()
export class BidsPubsub implements IPubsubController {
	constructor(
		@inject("IBasketService") private basketService: BasketService,
		@inject("IPubsubCore") private pubsubCore: PubsubCore
	) {
		this.pubsubCore.subscribe([Channels.NewBidChannel]);
		//this.basketService = new BasketService();

		this.pubsubCore.onNewBidMessage((msg) => {
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
		return this.pubsubCore.emitGetBidRequest(code, sessionId);
	}

	public onNewVendorBid(message: IPubsubMessage) {
		let messageData = message.data;
		let vendorBid: IVendorOfferData = messageData.data;

		console.log("onNewVendorBid ::", message);
		console.log("onNewVendorBid :: data ::", message.data);

		// Relay New bid message to client
		let newBidData = {
					type: "newBid",
					code: vendorBid.code,
					accepted: vendorBid.accepted,
					vendorId: vendorBid.vendorId
				};

		this.pubsubCore.publish(message.sessId, newBidData).then(newBidData => {
			Logger.logGreen("newBidData :: " + message.sessId + " ::", newBidData);
		}).catch(err => {
			Logger.logError("newBidData :: err ::" + message.sessId + " ::", err);
		});

		this.basketService.addToBasket(message.sessId, vendorBid).then(res => {
			this.pubsubCore.emitGetBestBasketMessage(message.sessId).then(res => {
				Logger.logYellow("¤¤¤¤¤¤ emitGetBestBasketMessage :: sessId ::", message.sessId);
			}).catch(err => {
				Logger.logError("¤¤¤¤¤¤ emitGetBestBasketMessage :: err ::", err);
			});

		}).catch(err => {
			console.log("onNewVendorBid :: error ::", err);
		});
	}
}
