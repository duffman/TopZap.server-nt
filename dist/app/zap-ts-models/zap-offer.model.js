"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class VendorOfferData {
    constructor(code, vendorId, title, offer) {
        this.code = code;
        this.vendorId = vendorId;
        this.title = title;
        this.offer = offer;
        this.accepted = true;
        this.rawData = null;
    }
}
exports.VendorOfferData = VendorOfferData;
// Converts JSON strings to/from your types
var ZapOfferResult;
(function (ZapOfferResult) {
    function toZapRes(json) {
        return JSON.parse(json);
    }
    ZapOfferResult.toZapRes = toZapRes;
    function zapResToJson(value) {
        return JSON.stringify(value);
    }
    ZapOfferResult.zapResToJson = zapResToJson;
})(ZapOfferResult = exports.ZapOfferResult || (exports.ZapOfferResult = {}));
