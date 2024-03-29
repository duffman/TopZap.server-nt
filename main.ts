/**
 * Patrik Forsberg ("CREATOR") CONFIDENTIAL
 * Unpublished Copyright (c) 2015-2018 Patrik Forsberg, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of CREATOR. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current CREATOR employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  CREATOR.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF CREATOR IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg - 2018
 */

import { injectable }             from 'inversify';
import { kernel }                 from "./kernel.config";
import { IZapNode }               from '@app/types/coldmind-node';
import { IAppSettings }           from '@app/app.settings';
import { AppSettings }            from '@app/app.settings';
import { ServerService }          from "@app/server.service";
import { Logger }                 from "@cli/cli.logger";
import { CliConfigFile }          from '@cli/cli.config-file';
import { WebApp }                 from "@app/webapp";

@injectable()
export class Bootstrap implements IZapNode {
	debugMode: boolean;

	constructor() {
		kernel.get<ServerService>("IServerService");
	}

	private createSettings(config: any): IAppSettings {
		let listenHost = (config.listenHost) ? config.listenHost : "127.0.0.1";
		let listenPort = (config.listenPort) ? config.port : 8080;

		return new AppSettings(listenHost, listenPort);
	}

	/**
	 * Execute the Server App
	 * @returns {boolean}
	 */
	public run(): boolean {
		let config = new CliConfigFile();

		try {
			let configData = config.getConfig();
			let settings = this.createSettings(configData);
			//this.app = new WebApp(settings);

			return true;
		} catch (err) {
			Logger.logError("Run Failed ::", err);
			return false;
		}
	}
}

let bootstrap = new Bootstrap();
//main.run();
