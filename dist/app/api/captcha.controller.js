"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const google_captcha_1 = require("@components/google-captcha");
class CaptchaController {
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
}
exports.CaptchaController = CaptchaController;
