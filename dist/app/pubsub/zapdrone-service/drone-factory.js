"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
Object.defineProperty(exports, "__esModule", { value: true });
const scaledrone_client_1 = require("@pubsub/scaledrone-service/scaledrone-client");
class DroneFactory {
    constructor() { }
    createDrone(channelId) {
        let drone = new scaledrone_client_1.ScaledroneClient(channelId);
        return drone;
    }
}
exports.DroneFactory = DroneFactory;
