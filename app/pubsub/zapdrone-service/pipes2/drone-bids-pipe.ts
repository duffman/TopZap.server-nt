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
import { ScaledroneClient }       from "@app/pubsub/scaledrone-service/scaledrone-client";

@injectable()
export class ServiceBidsPipe implements IDroneServicePipe {
	constructor() {
		//this.drone = new Scaledrone("0RgtaE9UstNGjTmu");
		let droneClient = new ScaledroneClient(ChannelNames.Bids);

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
	}

	/**
	 * New Vendor bid received through the PubSub service
	 * @param {IChannelMessage} message
	 */
	public onNewVendorBid(message: IChannelMessage) {
		let vendorBid = message.data;

		this.basketService.addToBasket(message.sessId, message.data).then(res => {
			console.log(this.basketService.addToBasket, message);
			// Tell the client to fetch the current basket (highest valued)
			let tmpDrone = new DroneCore(ChannelNames.Basket);
			tmpDrone.emitRaw("A405CP", { type: "getBasket"}); // <-- Tell the client to get the basket

		}).catch(err => {
			console.log("onNewVendorBid :: error ::", err);
		});

		console.log("onNewVendorBid :: -->");
	}
}
