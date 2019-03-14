"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));
var ProductItemTypes;
(function (ProductItemTypes) {
    ProductItemTypes[ProductItemTypes["GAME"] = 101] = "GAME";
    ProductItemTypes[ProductItemTypes["CD"] = 102] = "CD";
    ProductItemTypes[ProductItemTypes["DVD"] = 103] = "DVD";
    ProductItemTypes[ProductItemTypes["BLUERAY"] = 104] = "BLUERAY";
    ProductItemTypes[ProductItemTypes["GAME_CONSOLE"] = 105] = "GAME_CONSOLE";
    ProductItemTypes[ProductItemTypes["HARDWARE"] = 106] = "HARDWARE";
})(ProductItemTypes = exports.ProductItemTypes || (exports.ProductItemTypes = {}));
