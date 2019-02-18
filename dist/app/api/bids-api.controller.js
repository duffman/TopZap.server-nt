"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Scaledrone = require("scaledrone-node");
const cli_logger_1 = require("@cli/cli.logger");
const session_basket_1 = require("@zapModels/session-basket");
const channel_message_1 = require("@pubsub/channel-message");
const channel_config_1 = require("@pubsub/channel-config");
const channel_config_2 = require("@pubsub/channel-config");
const zap_message_types_1 = require("@zapModels/messages/zap-message-types");
const channel_1 = require("@pubsub/channel");
const controller_utils_1 = require("@api/controller.utils");
const basket_service_1 = require("@app/services/basket.service");
const channel_events_1 = require("@pubsub/channel-events");
const analytics_db_1 = require("@db/analytics-db");
const api_routes_1 = require("@api/api-routes");
const drone_core_1 = require("@pubsub/../pubsub-igniter.git/drone-core");
class BidsApiController {
    constructor() {
        this.analyticsDb = new analytics_db_1.AnalyticsDb();
        console.log("BidsApiController --- XXX");
        this.basketService = new basket_service_1.BasketService();
        //super(ChannelNames.Bids, MessagePipes.NewBid);
        this.drone = new Scaledrone("0RgtaE9UstNGjTmu");
        this.channel = this.drone.subscribe(channel_config_1.MessagePipes.GetBid);
        this.channel.on(channel_events_1.ChannelEvents.ChannelData, data => {
            console.log("XXX DATA ::", data);
        });
        // -- //
        this.channel = new channel_1.Channel(channel_config_2.ChannelNames.Bids, channel_config_1.MessagePipes.NewBid);
        this.channel.onChannelData((data) => {
            let sessId = data.sessId;
            console.log("NEW BID RECEIVED ::", data);
            if (data.type === zap_message_types_1.ZapMessageType.VendorOffer) {
                this.onNewVendorBid(data);
            }
            else {
                this.basketService.getReviewData(sessId).then(data => {
                    console.log("DATA ::", data);
                });
            }
        });
    }
    /**
     * New Vendor bid received through the PS service
     * @param {IChannelMessage} message
     */
    onNewVendorBid(message) {
        let vendorBid = message.data;
        this.basketService.addToBasket(message.sessId, message.data).then(res => {
            console.log(this.basketService.addToBasket, message);
            // Tell the client to fetch the current basket (highest valued)
            let tmpDrone = new drone_core_1.DroneCore(channel_config_2.ChannelNames.Basket);
            tmpDrone.emitRaw("A405CP", { type: "getBasket" });
        }).catch(err => {
            console.log("onNewVendorBid :: error ::", err);
        });
        console.log("onNewVendorBid :: -->");
    }
    apiGetBasket(req, resp) {
        console.log("apiGetBasket ::", req.session.id);
        this.basketService.getCurrentBasket(req.session.id).then(data => {
            resp.json(data);
        }).catch(err => {
            cli_logger_1.Logger.logError("apiGetBasket :: err ::", err);
        });
    }
    apiAddBasketItem(req, resp) {
        let data = req.body;
        let code = data.code;
        console.log("BIDS :: BODY ::", data);
        console.log("BIDS :: CODE ::", code);
        let res = this.doGetBids(code, req.session.id);
        controller_utils_1.ApiControllerUtils.jsonSuccess(resp, res);
    }
    apiDeleteBasketItem(req, resp) {
        let code = req.body.code;
        this.basketService.removeItem(code).then(res => {
        }).catch(err => {
        });
    }
    apiReviewBasket(req, resp) {
        let data = req.body;
        console.log("BASKET :: SESSION ID ::", req.session.id);
    }
    initRoutes(routes) {
        routes.post(api_routes_1.ApiRoutes.Basket.GET_BASKET, this.apiGetBasket.bind(this));
        routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_ADD, this.apiAddBasketItem.bind(this));
        routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_DELETE, this.apiDeleteBasketItem.bind(this));
        routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_REVIEW, this.apiReviewBasket.bind(this));
    }
    doGetBids(code, sessId) {
        let result = true;
        try {
            cli_logger_1.Logger.log(`BasketChannelController :: doGetOffers`);
            /*
            let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: code}, sessId);
            this.emitMessage(messData, MessagePipes.GetBid);
            Logger.logPurple("doGetBids :: CHANNEL-DATA ::", messData);
            */
            let messData = new channel_message_1.ChannelMessage(zap_message_types_1.ZapMessageType.GetOffers, { code: code }, sessId);
            console.log("BidsApiController :: Emitting ::", messData);
            this.channel.emitMessage(messData, channel_config_1.MessagePipes.GetBid);
            /*
            this.bidsDrone.publish(
                {room: MessagePipes.GetBid, message: messData }
            );
            */
        }
        catch (err) {
            cli_logger_1.Logger.logError("doGetBids :: ERROR ::", err);
            result = false;
        }
        return result;
    }
    getSessionBasket(sessId) {
        //let sessBasket = this.basketSessService.getSessionBasket(sessId);
        let sessBasket = new session_basket_1.SessionBasket();
        return sessBasket;
    }
}
exports.BidsApiController = BidsApiController;
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
