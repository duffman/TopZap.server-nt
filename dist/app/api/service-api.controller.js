"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
require("reflect-metadata");
const inversify_1 = require("inversify");
const api_routes_1 = require("@app/settings/api-routes");
let ServiceApiController = class ServiceApiController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
    }
    getToken(req, resp) {
        resp.json({ sessionId: req.session.id });
    }
    apiGetSessionData(req, resp, next) {
        let responseData = {
            key: req.session.id,
            numVen: 4
        };
        resp.json(responseData);
        next();
    }
    initRoutes(routes) {
        let scope = this;
        routes.all("/token", this.getToken.bind(this));
        routes.all(api_routes_1.ApiRoutes.Service.GET_SESSION_INFO, this.apiGetSessionData.bind(this));
    }
};
ServiceApiController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Boolean])
], ServiceApiController);
exports.ServiceApiController = ServiceApiController;
