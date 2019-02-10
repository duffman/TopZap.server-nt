/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */




/*
/*		app.use(function(req, res, next) {
			let rawBody = '';
			req.setEncoding('utf8');

			req.on('data', function(chunk) {
				rawBody += chunk;
			});

			console.log("====== RAW BODY ========");
			console.log(rawBody);

			console.log("========================");


			next();
		});
*/

export interface RequestHandler {
    // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
    (req: Request, res: Response, next: NextFunction): any;
}


import { IZynReqRouter }          from "./zyn.req-router";
import * as express               from "express";
import { Request, Response}       from 'express';
import { NextFunction, Router }   from 'express';

type expApp = express.Application;

class ZynRouter implements IZynReqRouter {
	constructor(public app: expApp) {
		this.debug();
	}

	public debug() {
		this.app.routes("/zyn").get((req: Request, res: Response) => {
				res.status(200).send({
					message: "Zynaptic Web - debugMode response"
				})
			});
	}

	public zynGet(name: string, req: Request, res: Response, next: NextFunction): any {
		this.app.routes.get(name, req, res, next());
	}

/*	public zynPost
	public zynPatch
	public zynPut
	public zynDelete
*/

	public routerMiddleware() {
	}
}

