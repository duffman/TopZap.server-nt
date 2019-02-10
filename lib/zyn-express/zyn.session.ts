/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Server Session Middleware
 *
 */

import { Router }                 from "express";
import { Response, Request }      from "express";
import { NextFunction }           from "express";
import { IZynMiddleware }         from "./zyn.middleware";

export class ZynSession implements IZynMiddleware {

	public initRoutes(routes: Router): void {
		let scope = this;

		routes.use("/*", (req: Request, resp: Response, next: NextFunction) => {
			/*if (typeof req.session.views !== 'undefined') {
				console.log(req.cookies['connect.sid']);
			}

			console.log("req.session.views ::", req.session.views);
			*/
			next(); // Call the next middleware
		});

	}
}


