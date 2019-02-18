"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const DateInterval_1 = require("@putte/date/DateInterval");
var Settings;
(function (Settings) {
    //export const allowedCORSOrigins = "*";
    Settings.allowedCORSOrigins = "http://127.0.0.1:4200";
    Settings.sessionCookieKey = "kaknyckel";
    Settings.sessionSecret = "1gulka9n";
    let Caching;
    (function (Caching) {
        Caching.UseCachedOffers = true;
        Caching.CacheTTL = DateInterval_1.DateInterval.days(10); // 5760; // 4 days
    })(Caching = Settings.Caching || (Settings.Caching = {}));
    let PriceServiceApi;
    (function (PriceServiceApi) {
        PriceServiceApi.Endpoint = "http://localhost:6562";
    })(PriceServiceApi = Settings.PriceServiceApi || (Settings.PriceServiceApi = {}));
    let MongoDb;
    (function (MongoDb) {
        MongoDb.mongoDbUrl = "mongodb://localhost:27017/TopZapDB";
    })(MongoDb = Settings.MongoDb || (Settings.MongoDb = {}));
    let Database;
    (function (Database) {
        Database.dbName = "topzap-prod";
        Database.dbHost = "localhost";
        Database.dbUser = "duffman";
        Database.dbPass = "bjoe7151212";
    })(Database = Settings.Database || (Settings.Database = {}));
})(Settings = exports.Settings || (exports.Settings = {}));
class AppSettings {
    constructor() { }
}
exports.AppSettings = AppSettings;
