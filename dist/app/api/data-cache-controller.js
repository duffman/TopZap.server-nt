"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cached_offers_db_1 = require("@db/cached-offers-db");
class DataCacheController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
        this.cachedOffersDb = new cached_offers_db_1.CachedOffersDb();
    }
    initRoutes(routes) {
    }
}
exports.DataCacheController = DataCacheController;
