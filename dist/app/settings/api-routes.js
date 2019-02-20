"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ApiRoutes;
(function (ApiRoutes) {
    //
    // Session
    //
    let Service;
    (function (Service) {
        Service.GET_SESSION_INFO = "/zap-session";
    })(Service = ApiRoutes.Service || (ApiRoutes.Service = {}));
    //
    // Basket
    //
    let Basket;
    (function (Basket) {
        Basket.GET_BASKET = "/basket";
        Basket.POST_BASKET_ADD = "/basket/add";
        Basket.POST_BASKET_DELETE = "/basket/del";
        Basket.POST_BASKET_CLEAR = "/basket/clear";
        Basket.POST_BASKET_REVIEW = "/basket/review";
    })(Basket = ApiRoutes.Basket || (ApiRoutes.Basket = {}));
})(ApiRoutes = exports.ApiRoutes || (exports.ApiRoutes = {}));
