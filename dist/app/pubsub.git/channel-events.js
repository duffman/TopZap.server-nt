"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ChannelEvents;
(function (ChannelEvents) {
    ChannelEvents.ChannelOpen = "open";
    ChannelEvents.ChannelData = "data";
    ChannelEvents.ChannelError = "error";
    ChannelEvents.ChannelClose = "close";
    ChannelEvents.ChannelDisconnect = "disconnect";
    ChannelEvents.ChannelReconnect = "reconnect";
})(ChannelEvents = exports.ChannelEvents || (exports.ChannelEvents = {}));
