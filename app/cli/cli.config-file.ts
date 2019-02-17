/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger }                 from '@cli/cli.logger';
import * as fs                    from 'fs';

export class CliConfigFile {
	constructor() {}

	public getConfig(configFilename = "/app.config.json"): any {
		let result = {};

		let configFile = __dirname + configFilename;
		Logger.logPurple("Reading config file ::", configFile);

		try {
			if (fs.existsSync(configFile)) {
				let contents = fs.readFileSync(configFile, "utf8");
				result = JSON.parse(contents);
			}
		} catch (ex) {
			Logger.logError("Error parsing config file ::", ex);
		}

		return result;
	}
}
