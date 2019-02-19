"use strict";
/**
* Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*/
Object.defineProperty(exports, "__esModule", { value: true });
const drone_events_1 = require("./drone-events");
class Channel {
    constructor(roomName, watch = false) {
        this.roomName = roomName;
    }
    attachEventHandlers() {
        let channel = this.channel;
        channel.on(drone_events_1.DroneEvents.Open, data => {
            this.eventEmitter.emit(drone_events_1.DroneEvents.Open, data);
        });
        channel.on(drone_events_1.DroneEvents.Data, data => {
            this.eventEmitter.emit(drone_events_1.DroneEvents.Data, data);
        });
        channel.on(drone_events_1.DroneEvents.Error, data => {
            this.eventEmitter.emit(drone_events_1.DroneEvents.Error, data);
        });
        channel.on(drone_events_1.DroneEvents.Close, data => {
            this.eventEmitter.emit(drone_events_1.DroneEvents.Close, data);
        });
        channel.on(drone_events_1.DroneEvents.Disconnect, data => {
            this.eventEmitter.emit(drone_events_1.DroneEvents.Disconnect, data);
        });
        channel.on(drone_events_1.DroneEvents.Reconnect, data => {
            this.eventEmitter.emit(drone_events_1.DroneEvents.Reconnect, data);
        });
    }
    onChannelOpen(listener) {
        this.eventEmitter.addListener(drone_events_1.DroneEvents.Open, listener);
    }
    onChannelData(listener) {
        this.eventEmitter.addListener(drone_events_1.DroneEvents.Data, listener);
    }
    onChannelError(listener) {
        this.eventEmitter.addListener(drone_events_1.DroneEvents.Error, listener);
    }
    onChannelClose(listener) {
        this.eventEmitter.addListener(drone_events_1.DroneEvents.Close, listener);
    }
    onChannelDisconnect(listener) {
        this.eventEmitter.addListener(drone_events_1.DroneEvents.Disconnect, listener);
    }
    onChannelReconnect(listener) {
        this.eventEmitter.addListener(drone_events_1.DroneEvents.Reconnect, listener);
    }
}
exports.Channel = Channel;
