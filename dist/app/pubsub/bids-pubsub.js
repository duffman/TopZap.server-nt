"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const basket_service_1 = require("@app/services/basket.service");
const zap_message_types_1 = require("@zapModels/messages/zap-message-types");
const pubsub_service_1 = require("@pubsub-lib/pubsub-service");
const pubsub_message_1 = require("@pubsub-lib/pubsub-message");
const pubsub_channels_1 = require("@pubsub-lib/pubsub-channels");
const cli_logger_1 = require("@cli/cli.logger");
let BidsPubsub = class BidsPubsub {
    constructor(basketService, pubsubService) {
        this.basketService = basketService;
        this.pubsubService = pubsubService;
        this.pubsubService.subscribe([pubsub_channels_1.Channels.NewBidChannel]);
        this.basketService = new basket_service_1.BasketService();
        this.pubsubService.onNewBidMessage((msg) => {
            this.onNewVendorBid(msg);
        });
    }
    /**
     * Call the Pubsub Service to pass on Get bid messages to connected vendor clients
     * @param {string} code
     * @param {string} sessionId
     */
    getBid(code, sessionId) {
        let message = new pubsub_message_1.PubsubMessage(zap_message_types_1.ZapMessageType.GetOffers, { code: code }, sessionId);
        return this.pubsubService.emitGetBidRequest(code, sessionId);
    }
    onNewVendorBid(message) {
        let messageData = message.data;
        let vendorBid = messageData.data;
        console.log("onNewVendorBid ::", message);
        console.log("onNewVendorBid :: data ::", message.data);
        // Relay New bid message to client
        let newBidData = {
            type: "newBid",
            code: vendorBid.code,
            accepted: vendorBid.accepted,
            vendorId: vendorBid.vendorId
        };
        this.pubsubService.publish(message.sessId, newBidData).then(newBidData => {
            cli_logger_1.Logger.logError("newBidData :: " + message.sessId + " ::", newBidData);
        }).catch(err => {
            cli_logger_1.Logger.logError("newBidData :: err ::" + message.sessId + " ::", err);
        });
        this.basketService.addToBasket(message.sessId, vendorBid).then(res => {
            this.pubsubService.emitGetBestBasketMessage(message.sessId).then(res => {
                cli_logger_1.Logger.logYellow("¤¤¤¤¤¤ emitGetBestBasketMessage :: sessId ::", message.sessId);
            }).catch(err => {
                cli_logger_1.Logger.logError("¤¤¤¤¤¤ emitGetBestBasketMessage :: err ::", err);
            });
        }).catch(err => {
            console.log("onNewVendorBid :: error ::", err);
        });
    }
};
BidsPubsub = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject("IBasketService")),
    __param(1, inversify_1.inject("IPubsubService")),
    __metadata("design:paramtypes", [basket_service_1.BasketService,
        pubsub_service_1.PubsubService])
], BidsPubsub);
exports.BidsPubsub = BidsPubsub;
