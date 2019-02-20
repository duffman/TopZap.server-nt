"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const basket_model_1 = require("./basket/basket.model");
class ZapBasketData {
    constructor(value = 0, bids = 0, basket = new basket_model_1.BasketModel()) {
        this.value = value;
        this.bids = bids;
        this.basket = basket;
    }
}
exports.ZapBasketData = ZapBasketData;
