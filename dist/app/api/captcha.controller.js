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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const google_captcha_1 = require("@components/google-captcha");
let CaptchaController = class CaptchaController {
    initRoutes(routes) {
        routes.post("/service/recaptcha", this.verifyCaptcha.bind(this));
    }
    getRemoteIp(req) {
        return req.connection.remoteAddress;
    }
    /**
     * Verify The Google Captcha Channenge
     * @param {} req
     * @param {} resp
     */
    verifyCaptcha(req, resp) {
        let gCaptcha = new google_captcha_1.GoogleCaptcha();
        console.log("verifyCaptcha :: BODY:: ", req.body);
        let gResponse = req.body.resp;
        let remoteIp = this.getRemoteIp(req);
        gCaptcha.verifyGCaptcha(gResponse, remoteIp).then(res => {
            resp.json(res);
        });
    }
};
CaptchaController = __decorate([
    inversify_1.injectable()
], CaptchaController);
exports.CaptchaController = CaptchaController;
