/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Request }                from 'express';
import { Response }               from 'express';
import { Router }                 from 'express';
import { IRestApiController }     from "@api/api-controller";
import { ApiRoutes }              from '@api/api-routes';
import { Logger }                 from '@cli/cli.logger';

export class PutteController implements IRestApiController {
	constructor(public debugMode: boolean = false) {
	}

	public initRoutes(routes: Router): void {
		routes.all("/putte", this.apiTest.bind(this));
	}

	private apiTest(req: Request, resp: Response): void {
		let testResp = {
			sessId: req.session.id
		};

		resp.json(testResp);
	}
}

let test = {
	data: {
		code: "348950"
	}
};

console.log("TESTJSON ::", JSON.stringify(test));
