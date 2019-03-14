"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const webapp_1 = require("@app/webapp");
const cli_logger_1 = require("@cli/cli.logger");
const pubsub_app_1 = require("@pubsub/pubsub-app");
let ServerService = class ServerService {
    constructor(webApp, pubsubApp) {
        this.webApp = webApp;
        this.pubsubApp = pubsubApp;
        webApp.initApp();
        pubsubApp.initApp();
    }
    initPubsubService() {
        cli_logger_1.Logger.logPurple("****** initPubsubService *******");
    }
};
ServerService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject("IWebApp")),
    __param(1, inversify_1.inject("IPubsubApp")),
    __metadata("design:paramtypes", [webapp_1.WebApp,
        pubsub_app_1.PubsubApp])
], ServerService);
exports.ServerService = ServerService;
