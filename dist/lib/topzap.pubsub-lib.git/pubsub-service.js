"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
Object.defineProperty(exports, "__esModule", { value: true });
const Pubnub = require("pubnub");
require("reflect-metadata");
const inversify_1 = require("inversify");
const pubsub_config_1 = require("./pubsub-config");
const pubsub_logger_1 = require("./pubsub-logger");
const events_1 = require("events");
const pubsub_message_1 = require("./pubsub-message");
const pubsub_message_2 = require("./pubsub-message");
const pubsub_channels_1 = require("./pubsub-channels");
let PubsubService = class PubsubService {
    constructor(autoSubscribe = false) {
        this.autoSubscribe = autoSubscribe;
        this.eventEmitter = new events_1.EventEmitter();
        this.pubnub = new Pubnub({
            publishKey: pubsub_config_1.PubsubConfig.PublishKey,
            subscribeKey: pubsub_config_1.PubsubConfig.SubscribeKey
        });
        this.listen();
    }
    publish(channel, data) {
        return new Promise((resolve, reject) => {
            let publishConfig = {
                channel: channel,
                message: JSON.stringify(data)
            };
            this.pubnub.publish(publishConfig).then((res) => {
                console.log("publish :: res ::", res);
                resolve(res);
            }).catch(err => {
                console.log("publish :: err ::", err);
                reject(err);
            });
        });
    }
    subscribe(channels) {
        this.pubnub.subscribe({
            channels: channels
        });
    }
    unsubscribe(channels) {
        this.pubnub.unsubscribe({
            channels: channels
        });
    }
    listen() {
        this.pubnub.addListener({
            status: (statusEvent) => {
                if (statusEvent.category === "PNConnectedCategory") {
                    //this.publishSampleMessage();
                    console.log("statusEvent.category === PNConnectedCategory");
                }
                console.log("statusEvent.category ::", statusEvent);
            },
            message: (msg) => {
                this.handleMessage(msg);
            },
            presence: (presenceEvent) => { }
        });
    }
    ////////////////////////////////////////////////////////////////////////
    // Move to separate class later ////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    /**
     * Setup channel subscription for user session
     * @param {string} sessId
     */
    connectSessionId(sessId) {
        this.sessionId = sessId;
        this.subscribe([sessId]);
    }
    emitNewBidMessage(data, sessId) {
        let message = new pubsub_message_2.PubsubMessage(pubsub_message_1.MessageTypes.NewBid, data, sessId);
        return this.publish(pubsub_channels_1.Channels.NewBidChannel, message);
    }
    emitGetBidRequest(code, sessId) {
        let data = { code: code };
        let message = new pubsub_message_2.PubsubMessage(pubsub_message_1.MessageTypes.GetBid, data, sessId);
        return this.publish(pubsub_channels_1.Channels.GetBidChannel, message);
    }
    /**
     * Emit message to a connected client by publishing to the session Id
     * @param {string} sessId
     * @returns {Promise<>}
     */
    emitGetBestBasketMessage(sessId) {
        //let message = new PubsubMessage(MessageTypes.GetBestBasket, { type: "reloadBasket" }, sessId);
        return this.publish(sessId, { type: "getBasket" });
    }
    /**
     * Handle incoming subscribed message
     * @param {MessageEvent} msg
     */
    handleMessage(msg) {
        pubsub_logger_1.PLogger.debug("msg.channel ::", msg.channel);
        pubsub_logger_1.PLogger.debug("msg.message", msg.message);
        pubsub_logger_1.PLogger.debug("msg.publisher ::", msg.publisher);
        console.log(" ");
        console.log(" ");
        let data = {};
        try {
            let messData = msg.message;
            data = JSON.parse(messData);
        }
        catch (ex) {
            pubsub_logger_1.PLogger.error("Error parsing message ::", msg);
        }
        console.log("******* DATA ::", data.type);
        switch (msg.channel) {
            case pubsub_channels_1.Channels.BasketChannel:
                this.eventEmitter.emit(pubsub_channels_1.Channels.BasketChannel, data);
                break;
            case pubsub_channels_1.Channels.GetBidChannel:
                this.eventEmitter.emit(pubsub_channels_1.Channels.GetBidChannel, data);
                break;
            case pubsub_channels_1.Channels.NewBidChannel:
                this.eventEmitter.emit(pubsub_channels_1.Channels.NewBidChannel, data);
                break;
            case pubsub_channels_1.Channels.ServiceChannel:
                this.eventEmitter.emit(pubsub_channels_1.Channels.ServiceChannel, data);
                break;
            case pubsub_channels_1.Channels.RequestHello:
                this.eventEmitter.emit(pubsub_channels_1.Channels.RequestHello, data);
                break;
            case pubsub_channels_1.Channels.ServiceHello:
                this.eventEmitter.emit(pubsub_channels_1.Channels.ServiceHello, data);
                break;
        }
    }
    onBasketMessage(listener) {
        this.eventEmitter.addListener(pubsub_channels_1.Channels.BasketChannel, listener);
    }
    onGetBidRequest(listener) {
        this.eventEmitter.addListener(pubsub_channels_1.Channels.GetBidChannel, listener);
    }
    onNewBidMessage(listener) {
        this.eventEmitter.addListener(pubsub_channels_1.Channels.NewBidChannel, listener);
    }
    onServiceMessage(listener) {
        this.eventEmitter.addListener(pubsub_channels_1.Channels.ServiceChannel, listener);
    }
    //
    // Tell services to say hello
    //
    onRequestHello(listener) {
        this.eventEmitter.addListener(pubsub_channels_1.Channels.RequestHello, listener);
    }
    //
    // A Service have said hello
    //
    onServiceHello(listener) {
        this.eventEmitter.addListener(pubsub_channels_1.Channels.ServiceHello, listener);
    }
};
PubsubService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Boolean])
], PubsubService);
exports.PubsubService = PubsubService;
