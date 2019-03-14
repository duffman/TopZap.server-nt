"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BasketAddResult {
    constructor(success = false, resultItem = null, basketData = null, prodData = new Array()) {
        this.success = success;
        this.resultItem = resultItem;
        this.basketData = basketData;
        this.prodData = prodData;
    }
}
exports.BasketAddResult = BasketAddResult;
