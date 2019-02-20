"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cli_logger_1 = require("@cli/cli.logger");
const session_basket_1 = require("@zapModels/session-basket");
const rest_utils_1 = require("@api/../utils/rest-utils");
const basket_service_1 = require("@app/services/basket.service");
const analytics_db_1 = require("@db/analytics-db");
const api_routes_1 = require("@app/settings/api-routes");
const channel_config_1 = require("@app/pubsub/scaledrone-service/channel-config");
class BidsApiController {
    constructor() {
        this.analyticsDb = new analytics_db_1.AnalyticsDb();
        console.log("BidsApiController --- XXX");
        this.basketService = new basket_service_1.BasketService();
        //super(ChannelNames.Bids, MessagePipes.NewBid);
        /*

        this.drone = new Scaledrone("0RgtaE9UstNGjTmu");
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
    onNewVendorBid(message) {
        let vendorBid = message.data;
        this.basketService.addToBasket(message.sessId, message.data).then(res => {
            console.log(this.basketService.addToBasket, message);
            // Tell the client to fetch the current basket (highest valued)
            let tmpDrone = new DroneCore(channel_config_1.ChannelNames.Basket);
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
        rest_utils_1.RestUtils.jsonSuccess(resp, res);
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
