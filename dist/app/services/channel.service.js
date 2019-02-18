"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Scaledrone = require("scaledrone-node");
const channel_events_1 = require("@pubsub/channel-events");
const zap_offer_model_1 = require("@zapModels/zap-offer.model");
const channel_config_1 = require("@pubsub/channel-config");
const channel_config_2 = require("@pubsub/channel-config");
const channel_config_3 = require("@pubsub/channel-config");
const product_db_1 = require("@db/product-db");
const basket_service_1 = require("@app/services/basket.service");
const drone_core_1 = require("@pubsub/../pubsub-igniter.git/drone-core");
class ChannelService {
    constructor() {
        this.basketService = new basket_service_1.BasketService();
        let code = "0887195000424";
        let sessId = "A405CP";
        this.db = new product_db_1.ProductDb();
        this.db.getGameData(code).then(data => {
            console.log("Drone :: db.getGameData ::", data);
        }).catch(err => {
            console.log("getGameData ::", err);
        });
        this.testCore = new drone_core_1.DroneCore(channel_config_2.ChannelNames.Basket);
        this.bidsDrone = new Scaledrone(channel_config_1.ChannelConfig.getChannelId(channel_config_2.ChannelNames.Bids));
        this.channel = this.bidsDrone.subscribe(channel_config_3.MessagePipes.NewBid);
        this.bidChannel = this.bidsDrone.subscribe(channel_config_3.MessagePipes.GetBid);
        this.reviewChannel = this.bidsDrone.subscribe(channel_config_3.MessagePipes.GetReview);
        this.basketDrone = new Scaledrone(channel_config_1.ChannelConfig.getChannelId(channel_config_2.ChannelNames.Basket));
        this.basketChannel = this.basketDrone.subscribe(channel_config_3.MessagePipes.GetBestBasket);
        this.bidsDrone.on('open', (err) => {
            console.log("bidsDrone ::", err);
        });
        this.basketDrone.on('open', (err) => {
            console.log("basketDrone ::", err);
        });
        //
        // New Bid
        //
        this.channel.on(channel_events_1.ChannelEvents.ChannelData, message => {
            console.log("NEW BID :: DATA ::", message);
            let sessId = message.sessId;
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
        this.basketChannel.on(channel_events_1.ChannelEvents.ChannelData, message => {
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
        this.bidChannel.on(channel_events_1.ChannelEvents.ChannelData, message => {
            console.log("GET BID ::", message);
        });
        //
        // Get Review
        //
        this.reviewChannel.on(channel_events_1.ChannelEvents.ChannelData, message => {
            console.log("GET REVIEW ::", message);
            this.basketService.getReviewData(message.sessId).then(res => {
                console.log("getFullBasket ::", res);
            }).catch(err => {
                console.log("getFullBasket :: err ::", err);
            });
        });
    }
    notifyClient(sessId) {
        this.testCore.emitRaw(sessId, { type: "getBasket" });
        /*		this.basketDrone.publish(
                    {room: sessId, message: { type: "getBasket"} }
                );
                */
    }
    testAdd(sessId) {
        let scope = this;
        let code = "0887195000424";
        function addToBasket(data) {
            return new Promise((resolve, reject) => {
                scope.basketService.addToBasket(sessId, data).then(res => {
                    console.log("addToBasket ::", res);
                    resolve();
                }).catch(err => {
                    console.log("addToBasket :: err ::", err);
                    reject(err);
                });
            });
        }
        async function addData() {
            let vendorOffer1 = new zap_offer_model_1.VendorOfferData(code, 13, "Kalle Kula", "0.15");
            let vendorOffer2 = new zap_offer_model_1.VendorOfferData(code, 14, "Kalle Kula", "0.25");
            let vendorOffer3 = new zap_offer_model_1.VendorOfferData(code, 16, "Kalle Kula", "1.15");
            let vendorOffer4 = new zap_offer_model_1.VendorOfferData(code, 17, "Kalle Kula", "3.15");
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
    testNotify() {
        this.notifyClient("A405CP");
    }
}
exports.ChannelService = ChannelService;
