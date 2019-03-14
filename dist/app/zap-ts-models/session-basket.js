"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SessionBasket {
    constructor(productData = new Array(), vendorBaskets = new Array()) {
        this.productData = productData;
        this.vendorBaskets = vendorBaskets;
    }
}
exports.SessionBasket = SessionBasket;
