/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Router }                 from "express";
import { IZynMiddleware }         from '@lib/zyn-express/zyn.middleware';

/**
 * API Controller
 */
export interface IApiController {
	debugMode: boolean;
}

export interface IRestApiController extends IApiController {
	initRoutes(routes: Router): void;
}