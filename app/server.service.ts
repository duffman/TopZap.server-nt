/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import "reflect-metadata";
import {inject, injectable}       from "inversify";
import { WebApp }                 from '@app/webapp';
import { Interface }              from '@root/kernel.config';

export interface IServerService {
}

@injectable()
export class ServerService implements IServerService {
	constructor(
		@inject("IWebApp") private webApp: WebApp
	) {
		console.log("ServerService !!!");
		webApp.initApp();
	}
}
