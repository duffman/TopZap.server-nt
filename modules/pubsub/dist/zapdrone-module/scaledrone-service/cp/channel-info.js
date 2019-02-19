/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
class DroneChanneConfig {
    constructor(channels) {
        this.channels = channels;
    }
}
exports.DroneChanneConfig = DroneChanneConfig;
class DroneChannel {
    constructor(name, channelID, secretKey) {
        this.name = name;
        this.channelID = channelID;
        this.secretKey = secretKey;
    }
}
exports.DroneChannel = DroneChannel;
var DroneChannelConvert;
(function (DroneChannelConvert) {
    function toIChannelConfig(json) {
        return JSON.parse(json);
    }
    DroneChannelConvert.toIChannelConfig = toIChannelConfig;
    function iChannelConfigToJson(value) {
        return JSON.stringify(value);
    }
    DroneChannelConvert.iChannelConfigToJson = iChannelConfigToJson;
})(DroneChannelConvert = exports.DroneChannelConvert || (exports.DroneChannelConvert = {}));
