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
let PutteController = class PutteController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
    }
    initRoutes(routes) {
        routes.all("/putte", this.apiTest.bind(this));
    }
    apiTest(req, resp) {
        let testResp = {
            sessId: req.session.id
        };
        resp.json(testResp);
    }
};
PutteController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Boolean])
], PutteController);
exports.PutteController = PutteController;
