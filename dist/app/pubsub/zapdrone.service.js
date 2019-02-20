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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const scaledrone_client_1 = require("@app/pubsub/scaledrone-service/scaledrone-client");
const channel_config_1 = require("@app/pubsub/scaledrone-service/channel-config");
let ZapdroneService = class ZapdroneService {
    constructor() {
        let drone = new scaledrone_client_1.ScaledroneClient(channel_config_1.ChannelNames.Bids);
        let droneService = new scaledrone_client_1.ScaledroneClient(channel_config_1.ChannelNames.Service);
        //droneService.
    }
};
ZapdroneService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], ZapdroneService);
exports.ZapdroneService = ZapdroneService;
