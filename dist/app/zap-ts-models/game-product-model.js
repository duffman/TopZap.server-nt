"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class GameProductData {
    constructor(id = -1, code = '', platformName = '', title = '', publisher = '', developer = '', genre = '', coverImage = '', thumbImage = '', videoSource = '', source = '', releaseDate = '', platformIcon = '', platformImage = '') {
        this.id = id;
        this.code = code;
        this.platformName = platformName;
        this.title = title;
        this.publisher = publisher;
        this.developer = developer;
        this.genre = genre;
        this.coverImage = coverImage;
        this.thumbImage = thumbImage;
        this.videoSource = videoSource;
        this.source = source;
        this.releaseDate = releaseDate;
        this.platformIcon = platformIcon;
        this.platformImage = platformImage;
    }
}
exports.GameProductData = GameProductData;
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
