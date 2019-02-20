"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DroneApiRoutes;
(function (DroneApiRoutes) {
    DroneApiRoutes.DRONE_GET_SESSION = "/zap-session";
})(DroneApiRoutes = exports.DroneApiRoutes || (exports.DroneApiRoutes = {}));
var DroneChannelRooms;
(function (DroneChannelRooms) {
    DroneChannelRooms.DRONE_SERVICE = "service";
    DroneChannelRooms.DRONE_SERVICE_REG = DroneChannelRooms.DRONE_SERVICE + "Reg";
    DroneChannelRooms.DRONE_SERVICE_UNREG = DroneChannelRooms.DRONE_SERVICE + "Unreg";
    DroneChannelRooms.DRONE_SERVICE_PING = DroneChannelRooms.DRONE_SERVICE + "Ping";
    DroneChannelRooms.DRONE_SERVICE_PONG = DroneChannelRooms.DRONE_SERVICE + "Pong";
    DroneChannelRooms.DRONE_SERVICE_DISCOVER = DroneChannelRooms.DRONE_SERVICE + "Discover";
})(DroneChannelRooms = exports.DroneChannelRooms || (exports.DroneChannelRooms = {}));
