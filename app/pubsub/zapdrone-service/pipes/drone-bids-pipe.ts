/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { injectable }             from "inversify";
import * as Scaledrone            from 'scaledrone-node';
import { IDroneServicePipe }      from "@app/pubsub/zapdrone-service/pipes/drone-service-pipe";
import {ChannelNames, MessagePipes} from "@app/pubsub/scaledrone-service/channel-config";
import { ScaledroneClient }       from "@app/pubsub/scaledrone-service/scaledrone-client";
import {DroneEvents} from '@scaledrone/drone-events';
import {BasketService} from '@app/services/basket.service';
import {DronePipeMessage} from '@zapdrone/drone-pipe-message';
import {ZapMessageType} from '@zapModels/messages/zap-message-types';


export interface IServiceBidsPipe extends IDroneServicePipe {
}

@injectable()
export class ServiceBidsPipe implements IDroneServicePipe {
	droneClient: ScaledroneClient;
	channel: any;
	basketService: BasketService;

	constructor() {
		//this.drone = new Scaledrone("0RgtaE9UstNGjTmu");
		this.basketService = new BasketService();

		this.droneClient = new ScaledroneClient(ChannelNames.Bids);
		this.channel = this.droneClient.subscribe(MessagePipes.NewBid); // <- suscribe on service client

		this.channel.on(DroneEvents.Data, data => {
			console.log("ON CHANNEL DATA ::", data);
			this.onNewVendorBid(data);
		});
	}

	public getBid(code: string, sessionId: string): void {
		let message = new DronePipeMessage(ZapMessageType.GetOffers, {code: code}, sessionId);
		this.droneClient.emitMessage(message, MessagePipes.GetBid);
	}

	public onNewVendorBid(message: any) {
		let vendorBid = message.data;
		console.log("onNewVendorBid ::", message);
		console.log("onNewVendorBid :: data ::", message.data);

		this.basketService.addToBasket(message.sessId, message.data).then(res => {
			console.log(this.basketService.addToBasket, message);
			// Tell the client to fetch the current basket (highest valued)
			let tmpDrone = new ScaledroneClient(ChannelNames.Basket); // Move to member var
//			tmpDrone.emitRaw("U93X03ErseacsjTESBN0tVJ7eOaxpG2Y", { type: "getBasket"});
			tmpDrone.emitRaw(message.sessId, { type: "getBasket"});
			//tmpDrone.emitRaw("A405CP", { type: "getBasket"}); // <-- Tell the client to get the basket

		}).catch(err => {
			console.log("onNewVendorBid :: error ::", err);
		});

		console.log("onNewVendorBid :: -->");
	}


	/*
	 this.channel = this.drone.subscribe(MessagePipes.GetBid);

	 this.channel.on(DroneEvents.Data, data => {
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
	 */

	/**
	 * New Vendor bid received through the PubSub service
	 * @param {IDronePipeMessage} message
	 */
}
