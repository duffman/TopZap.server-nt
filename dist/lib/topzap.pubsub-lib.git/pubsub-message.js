"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PubsubPayload {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.PubsubPayload = PubsubPayload;
class PubsubMessage {
    constructor(type, data = null, sessId = "", success = true, tag = null) {
        this.type = type;
        this.data = data;
        this.sessId = sessId;
        this.success = success;
        this.tag = tag;
    }
}
exports.PubsubMessage = PubsubMessage;
var MessageTypes;
(function (MessageTypes) {
    MessageTypes.GetBid = 'getBid';
    MessageTypes.GetReview = 'getReview';
    MessageTypes.GetBestBasket = 'getBest';
    MessageTypes.NewBid = 'newBid';
    MessageTypes.Broadcast = 'broadcast';
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
