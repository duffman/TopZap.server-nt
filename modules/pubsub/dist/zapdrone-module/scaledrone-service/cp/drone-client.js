/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
"use strict";
const Scaledrone = require('scaledrone-node');
const events_1 = require('events');
const channel_config_1 = require('./channel-config');
const drone_events_1 = require('./drone-events');
class MessQueueEntry {
    constructor(roomName, data) {
        this.roomName = roomName;
        this.data = data;
    }
}
exports.MessQueueEntry = MessQueueEntry;
class DroneClient {
    constructor(channelKey) {
        this.eventEmitter = new events_1.EventEmitter();
        this.messageQueue = new Array();
        let channelInfo = channel_config_1.ChannelConfig.getDroneChannel(channelKey);
        if (channelInfo === null) {
            let error = new Error("Channel not found");
            throw error;
        }
        this.drone = new Scaledrone(channelInfo.channelID);
        this.attachEventHandlers();
    }
    openChannel() {
        this.isOpen = true;
        console.log("--- Open Channel ---");
        while (this.messageQueue.length > 0) {
            let entry = this.messageQueue.pop();
            console.log("Emitting Queued message ::", entry);
            this.drone.publish({ room: entry.roomName, message: entry.data });
        }
    }
    closeChannel() {
        console.log("--- Close Channel ---");
        this.isOpen = false;
    }
    attachEventHandlers() {
        this.drone.on(drone_events_1.DroneEvents.Open, error => {
            console.log(drone_events_1.DroneEvents.Open, error);
            if (!error) {
                this.openChannel();
            }
            this.eventEmitter.emit(drone_events_1.DroneEvents.Open, error);
        });
        this.drone.on(drone_events_1.DroneEvents.Data, data => {
            console.log(drone_events_1.DroneEvents.Data, data);
            this.eventEmitter.emit(drone_events_1.DroneEvents.Data, data);
        });
        this.drone.on(drone_events_1.DroneEvents.Error, data => {
            console.log(drone_events_1.DroneEvents.Error, data);
            this.eventEmitter.emit(drone_events_1.DroneEvents.Error, data);
        });
        this.drone.on(drone_events_1.DroneEvents.Close, data => {
            console.log(drone_events_1.DroneEvents.Close, data);
            this.closeChannel();
            this.eventEmitter.emit(drone_events_1.DroneEvents.Close, data);
        });
        this.drone.on(drone_events_1.DroneEvents.Disconnect, data => {
            this.closeChannel();
            console.log(drone_events_1.DroneEvents.Disconnect, data);
            this.eventEmitter.emit(drone_events_1.DroneEvents.Disconnect, data);
        });
        this.drone.on(drone_events_1.DroneEvents.Reconnect, data => {
            console.log(drone_events_1.DroneEvents.Reconnect, data);
            this.eventEmitter.emit(drone_events_1.DroneEvents.Reconnect, data);
        });
    }
    emitMessage(message, roomName) {
        console.log("Emitting to Pipe '" + roomName + "'");
        this.emitRaw(roomName, message);
    }
    emitRaw(messagePipe, data) {
        if (!this.isOpen) {
            let queueEntry = new MessQueueEntry(messagePipe, data);
            console.log("Queueing Message ::", data);
            this.messageQueue.push(queueEntry);
        }
        else {
            this.drone.publish({ room: messagePipe, message: data });
        }
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
exports.DroneClient = DroneClient;