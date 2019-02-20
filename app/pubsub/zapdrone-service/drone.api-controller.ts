/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { IApiController }         from "@app/api/api-controller";
import { Router }                 from 'express';
import { Request }                from 'express';
import { Response }               from 'express';
import { NextFunction }           from 'express';
import { DroneApiRoutes } from "@pubsub/zapdrone-service/drone-api-routes";

export class DroneApiController implements IApiController {
	debugMode: boolean;

	constructor () {}


	public initRoutes (routes: Router): void {
	}
}
