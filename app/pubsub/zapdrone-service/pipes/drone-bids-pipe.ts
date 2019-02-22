/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { injectable }             from "inversify";
import * as Scaledrone            from 'scaledrone-node';
import { IDroneServicePipe }      from "@app/pubsub/zapdrone-service/pipes/drone-service-pipe";
import { ChannelNames }           from "@app/pubsub/scaledrone-service/channel-config";
import { MessagePipes}            from "@app/pubsub/scaledrone-service/channel-config";
import { ScaledroneClient }       from "@app/pubsub/scaledrone-service/scaledrone-client";
import { DroneEvents }            from '@scaledrone/drone-events';
import { BasketService }          from '@app/services/basket.service';
import { DronePipeMessage }       from '@zapdrone/drone-pipe-message';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';

export interface IServiceBidsPipe extends IDroneServicePipe {
}

@injectable()
export class ServiceBidsPipe implements IDroneServicePipe {
	bidsDrone: ScaledroneClient;
	basketDrone: ScaledroneClient;

	channel: any;
	basketService: BasketService;

	constructor() {
		//this.drone = new Scaledrone("0RgtaE9UstNGjTmu");
		this.basketService = new BasketService();

		this.bidsDrone = new ScaledroneClient(ChannelNames.Bids);
		this.basketDrone = new ScaledroneClient(ChannelNames.Basket); // Move to member var

		this.channel = this.bidsDrone.subscribe(MessagePipes.NewBid); // <- suscribe on service client

		this.channel.on(DroneEvents.Data, data => {
			console.log("ON CHANNEL DATA ::", data);
			this.onNewVendorBid(data);
		});
	}

	public getBid(code: string, sessionId: string): void {
		let message = new DronePipeMessage(ZapMessageType.GetOffers, {code: code}, sessionId);
		this.bidsDrone.emitMessage(message, MessagePipes.GetBid);
	}

	public onNewVendorBid(message: any) {
		let vendorBid = message.data;
		console.log("onNewVendorBid ::", message);
		console.log("onNewVendorBid :: data ::", message.data);

		this.basketService.addToBasket(message.sessId, message.data).then(res => {
			console.log(this.basketService.addToBasket, message);
			this.basketDrone.emitRaw(message.sessId, { type: "getBasket"});

		}).catch(err => {
			console.log("onNewVendorBid :: error ::", err);
		});
	}
}
