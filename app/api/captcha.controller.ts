/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { injectable }             from "inversify";
import { Request }                from "express";
import { Response }               from "express";
import { Router }                 from "express";
import { IRestApiController }     from '@api/api-controller';
import { GoogleCaptcha }          from '@components/google-captcha';

@injectable()
export class CaptchaController implements IRestApiController {
	debugMode: boolean;

	public initRoutes(routes: Router): void {
		routes.post("/service/recaptcha", this.verifyCaptcha.bind(this));
	}

	private getRemoteIp(req: Request): string {
		return req.connection.remoteAddress;
	}

	/**
	 * Verify The Google Captcha Channenge
	 * @param {} req
	 * @param {} resp
	 */
	private verifyCaptcha(req: Request, resp: Response): void {
		let gCaptcha = new GoogleCaptcha();

		console.log("verifyCaptcha :: BODY:: ", req.body);

		let gResponse = req.body.resp;
		let remoteIp = this.getRemoteIp(req);

		gCaptcha.verifyGCaptcha(gResponse, remoteIp).then(res => {
			resp.json(res);
		});
	}
}
