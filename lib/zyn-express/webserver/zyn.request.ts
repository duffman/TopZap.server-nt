/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as bodyParser            from "body-parser";
import * as cookieParser          from "cookie-parser";
import * as session               from "express-session";
import * as uidSafe               from "uid-safe";
import { Router }                 from "express";
import { Request }                from "express";
import { Response }               from "express";
import { NextFunction }           from "express";

export class ZynRequest {
	public session: any;
	constructor(public req: Request, public resp: Response, public next: NextFunction) {
		this.session = req.session;
	}
}
