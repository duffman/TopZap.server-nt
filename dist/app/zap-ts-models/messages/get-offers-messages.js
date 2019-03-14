"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class GetOffersDone {
    constructor(success = false) {
        this.success = success;
    }
}
exports.GetOffersDone = GetOffersDone;
class GetOffersInit {
    constructor(vendorCount = 0) {
        this.vendorCount = vendorCount;
    }
}
exports.GetOffersInit = GetOffersInit;
