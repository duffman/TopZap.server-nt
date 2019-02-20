"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const product_db_1 = require("@db/product-db");
const webapp_1 = require("@app/webapp");
const main_1 = require("./main");
const server_service_1 = require("@app/server.service");
let KernelModules = {
    ApiController: Symbol("IApiController")
};
exports.KernelModules = KernelModules;
let Interface = {
    ZapNode: "IZapNode",
    ServerService: "IServerService",
    WebApp: "IWebApp",
    ProductDb: "IProductDb"
};
exports.Interface = Interface;
let Tag = {
    Handler: "handler",
    Message: "message",
    DataModule: "data_module",
    ProtocolManager: "protocol_manager"
};
exports.Tag = Tag;
let kernel = new inversify_1.Container();
exports.kernel = kernel;
//
//
//
kernel.bind(Interface.ZapNode).to(main_1.Bootstrap);
kernel.bind(Interface.ServerService).to(server_service_1.ServerService).inSingletonScope();
kernel.bind(Interface.WebApp).to(webapp_1.WebApp).inSingletonScope();
kernel.bind(Interface.ProductDb).to(product_db_1.ProductDb).inSingletonScope();
