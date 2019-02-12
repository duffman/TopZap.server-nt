/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IRestApiController }     from "@api/api-controller";
import { Request }                from "express";
import { Response }               from "express";
import { Router }                 from "express";
import { Logger }                 from "@cli/cli.logger";
import { ZynPostData }            from '@lib/zyn-express/zyn.post-data';
import { ZynRemoteIp }            from '@lib/zyn-express/webserver/utils/zyn.remote-ip';
import { GoogleCaptcha }          from '@components/google-captcha';

export class ServiceApiController implements IRestApiController {
	constructor(public debugMode: boolean = false) {}

	/**
	 * Verify The Google Captcha Channenge
	 * @param {} req
	 * @param {} resp
	 */
	private verifyCaptcha(req: Request, resp: Response): void {
		let gCaptcha = new GoogleCaptcha();

		let zynPostRequest = new ZynPostData();

		console.log("verifyCaptcha :: BODY:: ", req.body);

		let gResponse = req.body.resp;
		let remoteIp = ZynRemoteIp.getRemoteIp(req);

		gCaptcha.verifyGCaptcha(gResponse, remoteIp).then(res => {
			resp.json(res);
		});
	}

	private getToken(req: Request, resp: Response): void {
		resp.json({token: req.sessionID});
	}

	public initRoutes(routes: Router): void {
		let scope = this;


		routes.post("/token", this.getToken.bind(this));


		routes.get("/test2", function(req, res) {
			console.log("TypeOf Session ::", typeof req.session);
			res.end('welcome to the session demo. refresh! :: ');
		});

		routes.post("/service/recaptcha", this.verifyCaptcha.bind(this));

		//
		// Get Miner Session
		//
		routes.get("/service/kind:id", (req, resp) => {
			Logger.logCyan("Miner Name ::", name);

			let kind = req.params.kind;

			let body = `<html><body>
					<h1>TopZap Api - Service</h1>

			</body></html>`;


			resp.send(body);
			resp.end();
		});
	}
}
