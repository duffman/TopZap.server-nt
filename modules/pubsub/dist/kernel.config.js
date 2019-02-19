"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let KernelTypes = {
    MessageHub: Symbol("IMessageHub")
};
exports.KernelTypes = KernelTypes;
let Tag = {
    Handler: "handler",
    Message: "message",
    DataModule: "data_module",
    DbModel: "table_model",
    ProtocolManager: "protocol_manager"
};
exports.Tag = Tag;
let kernel = new inversify_1.Container();
exports.kernel = kernel;
/********************************************************************************************
 * ColdmindServerCore Kernel
 ***/
kernel.bind("IZynService").to(ServerService);
kernel.bind("IMessageHub").to(MessageHub).inSingletonScope();
kernel.bind("IConnectionHub").to(ConnectionHub).inSingletonScope();
kernel.bind("INetworkHub").to(NetworkHub).inSingletonScope();
kernel.bind("IMessageEmitter").to(MessageEmitter).inSingletonScope();
kernel.bind("IServiceHub").to(ServiceHub).inSingletonScope();
//
// Bind Network Protocol Managers
//
// Socket.IO
kernel.bind("INetworkConnector")
    .to(SocketIONetworkConnector).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
// Standard WebSocket
kernel.bind("INetworkConnector")
    .to(WebSocketNetworkConnector).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
