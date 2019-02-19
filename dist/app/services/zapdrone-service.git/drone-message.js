"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DroneMessage {
    constructor(type, data = null, sessId = "", success = true, tag = null) {
        this.type = type;
        this.data = data;
        this.sessId = sessId;
        this.success = success;
        this.tag = tag;
    }
}
exports.DroneMessage = DroneMessage;
