"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BasketModel {
    constructor(items = new Array(), totalValue = 0) {
        this.items = items;
        this.totalValue = totalValue;
    }
}
exports.BasketModel = BasketModel;
