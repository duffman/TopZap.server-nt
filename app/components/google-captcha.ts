/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IZapResult }             from '@zapModels/zap-result';
import { ZapResult }              from '@zapModels/zap-result';
import { ZynPostData}             from '@lib/zyn-express/zyn.post-data';

export class GoogleCaptcha {
	constructor() {}

	public verifyGCaptcha(gResponse: string, remoteIp: string = ''): Promise<IZapResult> {
		let result = new ZapResult();
		let zynPostRequest = new ZynPostData();

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
			zynPostRequest.postData2(googleReCaptchaUrl, payload).then(res => {
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