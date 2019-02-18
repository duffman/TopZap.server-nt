"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ProductData {
    constructor(id = -1, code = '', title = '') {
        this.id = id;
        this.code = code;
        this.title = title;
    }
}
exports.ProductData = ProductData;
var Convert;
(function (Convert) {
    function toProductData(json) {
        return JSON.parse(json);
    }
    Convert.toProductData = toProductData;
    function productDataToJson(value) {
        return JSON.stringify(value);
    }
    Convert.productDataToJson = productDataToJson;
})(Convert = exports.Convert || (exports.Convert = {}));
