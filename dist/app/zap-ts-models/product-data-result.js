"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ProductDataResult {
    constructor(success = false, error = null, productData = null) {
        this.success = success;
        this.error = error;
        this.productData = productData;
    }
}
exports.ProductDataResult = ProductDataResult;
