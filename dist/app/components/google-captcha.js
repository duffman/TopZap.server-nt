"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const zap_result_1 = require("@zapModels/zap-result");
const http_post_data_1 = require("@app/utils/http-post-data");
class GoogleCaptcha {
    constructor() { }
    verifyGCaptcha(gResponse, remoteIp = '') {
        let result = new zap_result_1.ZapResult();
        let httpPostData = new http_post_data_1.HttpPostData();
        // Needs to differ for different routes??
        let appSecret = "6LeYWn4UAAAAADNvTRK3twgps530_PnrO8ZuuaPM";
        let payload = {
            "form": {
                "secret": appSecret,
                "response": gResponse,
                "remoteip": remoteIp
            }
        };
        const googleReCaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";
        return new Promise((resolve, reject) => {
            httpPostData.postData(googleReCaptchaUrl, payload).then(res => {
                console.log("res ::", res);
                //let gRes = GCAPTCHAResult.toIGCAPTCHAResult(res);
                result.success = res.success;
                console.log("result ::", result);
                console.log("result.success ::", result.success);
                resolve(result);
            }).catch(err => {
                console.log("err ::", err);
                result.error = err;
                resolve(result);
            });
        });
    }
}
exports.GoogleCaptcha = GoogleCaptcha;
