"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BasketItem {
    constructor(zid, itemType, code = null, vendorId = null, title = null, offer = null, publisher = null, releaseDate = null, thumbImage = null, platformIcon = null, count = 1) {
        this.zid = zid;
        this.itemType = itemType;
        this.code = code;
        this.vendorId = vendorId;
        this.title = title;
        this.offer = offer;
        this.publisher = publisher;
        this.releaseDate = releaseDate;
        this.thumbImage = thumbImage;
        this.platformIcon = platformIcon;
        this.count = count;
    }
}
exports.BasketItem = BasketItem;
