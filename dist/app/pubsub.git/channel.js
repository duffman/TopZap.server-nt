"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Scaledrone = require("scaledrone-node");
const events_1 = require("events");
const channel_config_1 = require("./channel-config");
const channel_events_1 = require("./channel-events");
class Channel {
    constructor(channelName, messagePipe) {
        this.channelName = channelName;
        this.messagePipe = messagePipe;
        this.eventEmitter = new events_1.EventEmitter();
        let channelInfo = channel_config_1.ChannelConfig.getDroneChannel(channelName);
        if (channelInfo === null) {
            let error = new Error("Channel not found");
            throw error;
        }
        this.drone = new Scaledrone(channelInfo.channelID);
        this.drone.on('open', () => {
            //this.eventEmitter.removeAllListeners();
            this.channel = this.drone.subscribe(messagePipe);
            this.attachEventHandlers();
        });
    }
    attachEventHandlers() {
        this.channel.on(channel_events_1.ChannelEvents.ChannelOpen, data => {
            console.log(channel_events_1.ChannelEvents.ChannelOpen, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelOpen, data);
        });
        this.channel.on(channel_events_1.ChannelEvents.ChannelData, data => {
            console.log(channel_events_1.ChannelEvents.ChannelData, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelData, data);
        });
        this.channel.on(channel_events_1.ChannelEvents.ChannelError, data => {
            console.log(channel_events_1.ChannelEvents.ChannelError, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelError, data);
        });
        this.channel.on(channel_events_1.ChannelEvents.ChannelClose, data => {
            console.log(channel_events_1.ChannelEvents.ChannelClose, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelClose, data);
        });
        this.channel.on(channel_events_1.ChannelEvents.ChannelDisconnect, data => {
            console.log(channel_events_1.ChannelEvents.ChannelDisconnect, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelDisconnect, data);
        });
        this.channel.on(channel_events_1.ChannelEvents.ChannelReconnect, data => {
            console.log(channel_events_1.ChannelEvents.ChannelReconnect, data);
            this.eventEmitter.emit(channel_events_1.ChannelEvents.ChannelReconnect, data);
        });
    }
    emitMessage(message, messagePipe = null) {
        console.log("Emitting to Pipe '" + messagePipe + "'");
        messagePipe = messagePipe !== null ? messagePipe : this.messagePipe;
        this.drone.publish({ room: messagePipe, message: message });
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
exports.Channel = Channel;
