

/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Router }                 from "express";
import { IZynMiddleware }         from "@zynIgniter/../../lib/zyn-express/zyn.middleware";
import { IZynSocketServer }          from '@igniter/coldmind/zyn-socket.server';
import {ClientSocket} from '@igniter/coldmind/socket-io.client';

/**
 * Core Controller
 */
export interface IWebAppController extends IZynMiddleware {
}

/**
 * API Controller
 */
export interface IApiController extends IWebAppController {
	debugMode: boolean;
}

export interface IRestApiController extends IApiController {
	initRoutes(routes: Router): void;
}

export interface IWSApiController extends IApiController {
	attachWSS(wss: IZynSocketServer): void;
	attachServiceClient(client: ClientSocket): void;
}