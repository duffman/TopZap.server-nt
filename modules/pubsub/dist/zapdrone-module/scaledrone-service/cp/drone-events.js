/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
var DroneEvents;
(function (DroneEvents) {
    DroneEvents.Open = "open";
    DroneEvents.Data = "data";
    DroneEvents.Error = "error";
    DroneEvents.Close = "close";
    DroneEvents.Disconnect = "disconnect";
    DroneEvents.Reconnect = "reconnect";
})(DroneEvents = exports.DroneEvents || (exports.DroneEvents = {}));
