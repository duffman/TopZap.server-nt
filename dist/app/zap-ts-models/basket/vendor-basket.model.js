"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const basket_model_1 = require("./basket.model");
class VendorBasketModel extends basket_model_1.BasketModel {
    constructor(vendorId) {
        super();
        this.vendorId = vendorId;
    }
}
exports.VendorBasketModel = VendorBasketModel;
