/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IRestApiController }     from "@api/api-controller";
import { Request }                from "express";
import { Response }               from "express";
import { Router }                 from "express";

export class ServiceApiController implements IRestApiController {
	constructor(public debugMode: boolean = false) {}

	private getToken(req: Request, resp: Response): void {
		resp.json({token: req.session.id});
	}

	public initRoutes(routes: Router): void {
		let scope = this;
		routes.all("/token", this.getToken.bind(this));
	}
}
