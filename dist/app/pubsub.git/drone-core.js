"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Scaledrone = require("scaledrone-node");
const channel_config_1 = require("@pubsub/channel-config");
const channel_events_1 = require("@pubsub/channel-events");
const events_1 = require("events");
class MessQueueEntry {
    constructor(messagePipe, data) {
        this.messagePipe = messagePipe;
        this.data = data;
    }
}
exports.MessQueueEntry = MessQueueEntry;
class DroneCore {
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
        /*
        this.drone.on('open', () => {
            //this.eventEmitter.removeAllListeners();
            //this.channel = this.drone.subscribe(messagePipe);
            this.attachEventHandlers();
        });
        */
    }
    openChannel() {
        this.isOpen = true;
        console.log("--- Open Channel ---");
        while (this.messageQueue.length > 0) {
            let entry = this.messageQueue.pop();
            console.log("Emitting Queued message ::", entry);
            this.drone.publish({ room: entry.messagePipe, message: entry.data });
        }
    }
    closeChannel() {
        console.log("--- Close Channel ---");
        this.isOpen = false;
    }
    attachEventHandlers() {
        this.drone.on(channel_events_1.ChannelEvents.ChannelOpen, error => {
            console.log(channel_events_1.ChannelEvents.ChannelOpen, error);
            if (!error) {
                this.openChannel();
            }
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelOpen, error);
        });
        this.drone.on(channel_events_1.ChannelEvents.ChannelData, data => {
            console.log(channel_events_1.ChannelEvents.ChannelData, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelData, data);
        });
        this.drone.on(channel_events_1.ChannelEvents.ChannelError, data => {
            console.log(channel_events_1.ChannelEvents.ChannelError, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelError, data);
        });
        this.drone.on(channel_events_1.ChannelEvents.ChannelClose, data => {
            console.log(channel_events_1.ChannelEvents.ChannelClose, data);
            this.closeChannel();
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelClose, data);
        });
        this.drone.on(channel_events_1.ChannelEvents.ChannelDisconnect, data => {
            this.closeChannel();
            console.log(channel_events_1.ChannelEvents.ChannelDisconnect, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelDisconnect, data);
        });
        this.drone.on(channel_events_1.ChannelEvents.ChannelReconnect, data => {
            console.log(channel_events_1.ChannelEvents.ChannelReconnect, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelReconnect, data);
        });
    }
    emitMessage(message, messagePipe) {
        console.log("Emitting to Pipe '" + messagePipe + "'");
        this.emitRaw(messagePipe, message);
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
        //this.drone.publish({room: messagePipe, message: data});
    }
    onChannelOpen(listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelOpen, listener);
    }
    onChannelData(listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelData, listener);
    }
    onChannelError(listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelError, listener);
    }
    onChannelClose(listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelClose, listener);
    }
    onChannelDisconnect(listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelDisconnect, listener);
    }
    onChannelReconnect(listener) {
        this.eventEmitter.addListener(channel_events_1.ChannelEvents.ChannelReconnect, listener);
    }
}
exports.DroneCore = DroneCore;
