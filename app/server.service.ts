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
import {DroneWorkersPipe} from '@zapdrone/pipes/drone-workers-pipe';
import {Logger} from '@cli/cli.logger';

export interface IServerService {
}

@injectable()
export class ServerService implements IServerService {
	constructor(
		@inject("IWebApp") private webApp: WebApp,
		@inject("IDroneWorkersPipe") private droneWorkersPipe: DroneWorkersPipe
	) {
		console.log("ServerService !!!");
		webApp.initApp();

		droneWorkersPipe.startService().then(res => {
			Logger.logPurple("droneWorkersPipe.startService ::", res);
		}).catch(err => {
			Logger.logError("droneWorkersPipe.startService :: err ::", err);
		});
	}
}
