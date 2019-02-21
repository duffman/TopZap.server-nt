/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IRestApiController }     from "@api/api-controller";
import { Request }                from "express";
import { Response }               from "express";
import { NextFunction }           from "express";
import { Router }                 from "express";
import { ApiRoutes }              from "@app/settings/api-routes";

export class ServiceApiController implements IRestApiController {
	constructor(public debugMode: boolean = false) {}

	private getToken(req: Request, resp: Response): void {
		resp.json({sessionId: req.session.id});
	}

	private apiGetSessionData(req: Request, resp: Response, next: NextFunction): void {
		let responseData = {
			key: req.session.id
		};

		resp.json(responseData);
		next();
	}

	public initRoutes(routes: Router): void {
		let scope = this;
		routes.all("/token", this.getToken.bind(this));
		routes.all(ApiRoutes.Service.GET_SESSION_INFO, this.apiGetSessionData.bind(this));
	}
}
