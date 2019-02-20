"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ZapMessageType;
(function (ZapMessageType) {
    ZapMessageType.GetOffers = 'getOffers';
    ZapMessageType.GetOffersInit = 'getOffersInit';
    ZapMessageType.VendorOffer = 'vendorOffer';
    ZapMessageType.GetOffersDone = 'getOffersDone';
    ZapMessageType.GCaptchaVerify = 'gcapV';
    ZapMessageType.GetVendors = 'getVendors';
    ZapMessageType.VendorsList = 'vendorsList';
    //
    // Error Types
    //
    ZapMessageType.ErrInvalidCode = 'invalidCode';
    //
    // Basket Messages
    //
    ZapMessageType.BasketGet = 'basketGet';
    ZapMessageType.BasketAdd = 'basketAdd';
    ZapMessageType.BasketRem = 'basketRem';
    ZapMessageType.BasketRemRes = 'basketRemRes';
    ZapMessageType.BasketPull = 'basketPull';
    ZapMessageType.BasketAddRes = 'basketAddResult';
})(ZapMessageType = exports.ZapMessageType || (exports.ZapMessageType = {}));
