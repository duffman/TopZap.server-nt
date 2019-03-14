"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const product_db_1 = require("@db/product-db");
const webapp_1 = require("@app/webapp");
const main_1 = require("./main");
const server_service_1 = require("@app/server.service");
const bids_api_controller_1 = require("@api/bids-api.controller");
const captcha_controller_1 = require("@api/captcha.controller");
const data_cache_controller_1 = require("@api/data-cache-controller");
const product_api_controller_1 = require("@api/product-api.controller");
const putte_controller_1 = require("@api/putte.controller");
const service_api_controller_1 = require("@api/service-api.controller");
const basket_service_1 = require("@app/services/basket.service");
const bids_pubsub_1 = require("@pubsub/bids-pubsub");
const pubsub_service_1 = require("@pubsub-lib/pubsub-service");
const pubsub_app_1 = require("@pubsub/pubsub-app");
let KernelModules = {
    ApiController: Symbol("IApiController")
};
exports.KernelModules = KernelModules;
let Interface = {
    ZapNode: "IZapNode",
    ServerService: "IServerService",
    WebApp: "IWebApp",
    ProductDb: "IProductDb",
    BasketService: "IBasketService",
    // Controllers
    RestApiController: "IRestApiController",
    PubsubController: "IPubsubController",
    PubsubApp: "IPubsubApp",
    PubsubService: "IPubsubService"
};
exports.Interface = Interface;
let Tag = {
    Handler: "handler",
    Message: "message",
    DataModule: "data_module",
    ProtocolManager: "protocol_manager",
    ApiController: "api_controller"
};
exports.Tag = Tag;
let kernel = new inversify_1.Container();
exports.kernel = kernel;
//
//
kernel.bind(Interface.ZapNode).to(main_1.Bootstrap);
kernel.bind(Interface.ServerService).to(server_service_1.ServerService).inSingletonScope();
kernel.bind(Interface.WebApp).to(webapp_1.WebApp).inSingletonScope();
kernel.bind(Interface.ProductDb).to(product_db_1.ProductDb).inSingletonScope();
kernel.bind(Interface.BasketService).to(basket_service_1.BasketService).inSingletonScope();
kernel.bind(Interface.PubsubController).to(bids_pubsub_1.BidsPubsub).inSingletonScope();
kernel.bind(Interface.PubsubService).to(pubsub_service_1.PubsubService).inSingletonScope();
kernel.bind(Interface.PubsubApp).to(pubsub_app_1.PubsubApp).inSingletonScope();
//
// Drone related
//
//
// API Controllers
//
kernel.bind(Interface.RestApiController)
    .to(bids_api_controller_1.BidsApiController).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
kernel.bind(Interface.RestApiController)
    .to(captcha_controller_1.CaptchaController).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
kernel.bind(Interface.RestApiController)
    .to(data_cache_controller_1.DataCacheController).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
kernel.bind(Interface.RestApiController)
    .to(product_api_controller_1.ProductApiController).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
kernel.bind(Interface.RestApiController)
    .to(putte_controller_1.PutteController).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
kernel.bind(Interface.RestApiController)
    .to(service_api_controller_1.ServiceApiController).inSingletonScope()
    .whenTargetTagged(Tag.Handler, Tag.ApiController);
