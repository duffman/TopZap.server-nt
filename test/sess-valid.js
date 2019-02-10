"use strict";
exports.__esModule = true;
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var basket_collection_1 = require("../app/zap-ts-models/basket-collection");
var basketSess = new basket_collection_1.SessionBasket();
console.log("typeof basketSess", typeof basketSess);
var kalle1 = (basketSess instanceof basket_collection_1.SessionBasket);
//export function from<T>(input: ObservableInput<T>, scheduler?: SchedulerLike): Observable<T> {
console.log("kalle1 ::", kalle1);
//console.log("kalle2 ::", kalle2);
