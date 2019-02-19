"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const main_1 = require("./main");
let KernelTypes = {
    MessageHub: Symbol("IMessageHub")
};
exports.KernelTypes = KernelTypes;
let Tag = {
    Handler: "handler",
    Message: "message",
    DataModule: "data_module",
    ProtocolManager: "protocol_manager"
};
exports.Tag = Tag;
let kernel = new inversify_1.Container();
exports.kernel = kernel;
kernel.bind("IColdmindNode").to(main_1.Main);
