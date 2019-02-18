/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone            from 'scaledrone-node';
import { ChannelEvents }          from '@pubsub/channel-events';
import { VendorOfferData }        from '@zapModels/zap-offer.model';
import { ChannelConfig }          from '@pubsub/channel-config';
import { ChannelNames }           from '@pubsub/channel-config';
import { MessagePipes }           from '@pubsub/channel-config';
import { ProductDb }              from '@db/product-db';
import { BasketService }          from '@app/services/basket.service';
import { DroneCore }              from '@pubsub/../pubsub-igniter.git/drone-core';

export class ChannelService {	bidsDrone: any;
	basketDrone: any;
	db: ProductDb;

	channel: any;
	bidChannel: any;
	basketChannel: any;
	reviewChannel: any;

	testCore: DroneCore;

	basketService: BasketService;

	constructor() {
		this.basketService = new BasketService();

		let code = "0887195000424";
		let sessId = "A405CP";

		this.db = new ProductDb();
		this.db.getGameData(code).then(data => {
			console.log("Drone :: db.getGameData ::", data);

		}).catch(err => {
			console.log("getGameData ::", err);
		});


		this.testCore = new DroneCore(ChannelNames.Basket);


		this.bidsDrone = new Scaledrone(ChannelConfig.getChannelId(ChannelNames.Bids));
		this.channel = this.bidsDrone.subscribe(MessagePipes.NewBid);
		this.bidChannel = this.bidsDrone.subscribe(MessagePipes.GetBid);
		this.reviewChannel = this.bidsDrone.subscribe(MessagePipes.GetReview);

		this.basketDrone = new Scaledrone(ChannelConfig.getChannelId(ChannelNames.Basket));
		this.basketChannel = this.basketDrone.subscribe(MessagePipes.GetBestBasket);

		this.bidsDrone.on('open', (err) => {
			console.log("bidsDrone ::", err);
		});

		this.basketDrone.on('open', (err) => {
			console.log("basketDrone ::", err);
		});

		//
		// New Bid
		//
		this.channel.on(ChannelEvents.ChannelData, message => {
			console.log("NEW BID :: DATA ::", message);
			let sessId: string = message.sessId;
			let data = message.data;

			this.basketService.addToBasket(message.sessId, data).then(res => {
				console.log("addToBasket ::", res);
				//this.notifyClient(sessId);
				this.notifyClient("A405CP");

			}).catch(err => {
				console.log("addToBasket :: err ::", err);
			});
		});

		//
		// Get Best Basket
		//
		this.basketChannel.on(ChannelEvents.ChannelData, message => {
			let scope = this;
			console.log("GET BEST BASKET ::", message);

			scope.basketService.getCurrentBasket(message.sessId).then(res => {
				console.log("getCurrentBasket ::", res);

			}).catch(err => {
				console.log("basketChannel :: err ::", err);
			});
		});

		//
		// Get Bid
		//
		this.bidChannel.on(ChannelEvents.ChannelData, message => {
			console.log("GET BID ::", message);

		});

		//
		// Get Review
		//
		this.reviewChannel.on(ChannelEvents.ChannelData, message => {
			console.log("GET REVIEW ::", message);

			this.basketService.getReviewData(message.sessId).then(res => {
				console.log("getFullBasket ::", res);

			}).catch(err => {
				console.log("getFullBasket :: err ::", err);
			});
		});
	}

	public notifyClient(sessId: string) {
		this.testCore.emitRaw(sessId, { type: "getBasket"});

/*		this.basketDrone.publish(
			{room: sessId, message: { type: "getBasket"} }
		);
		*/
	}

	public testAdd(sessId: string) {
		let scope = this;
		let code = "0887195000424";

		function addToBasket(data: VendorOfferData): Promise<void> {
			return new Promise((resolve, reject) => {
				scope.basketService.addToBasket(sessId, data).then(res => {
					console.log("addToBasket ::", res);
					resolve();
				}).catch(err => {
					console.log("addToBasket :: err ::", err);
					reject(err)
				});
			});
		}

		async function addData(): Promise<void> {
			let vendorOffer1 = new VendorOfferData(code, 13, "Kalle Kula", "0.15");
			let vendorOffer2 = new VendorOfferData(code, 14, "Kalle Kula", "0.25");
			let vendorOffer3 = new VendorOfferData(code, 16, "Kalle Kula", "1.15");
			let vendorOffer4 = new VendorOfferData(code, 17, "Kalle Kula", "3.15");

			await addToBasket(vendorOffer1);
			await addToBasket(vendorOffer2);
			await addToBasket(vendorOffer3);
			await addToBasket(vendorOffer4);
		}

		addData().then(() => {
			console.log("Data added");
		}).catch(err => {
			console.log("Error adding data ::", err);
		});
	}

	public testNotify() {
		this.notifyClient("A405CP");
	}
}