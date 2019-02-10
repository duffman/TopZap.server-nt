/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {Logger} from '@cli/cli.logger';
import * as fs from 'fs';

export interface IConfigFile {
	port: number;
}

export class CliConfigFile {
	constructor(public defaultPort: number = 8080,
				public fileEncoding: string = "utf8") {}

	public getConfig(configFilename = "/app.config.json"): IConfigFile {
		let result = { port: this.defaultPort };
		let configFile = __dirname + configFilename;
		Logger.logPurple("Reading config file ::", configFile);

		try {
			if (fs.existsSync(configFile)) {
				let contents = fs.readFileSync(configFile, this.fileEncoding);
				result = JSON.parse(contents);
			}
		} catch (ex) {
			Logger.logError("Error parsing config file ::", ex);
		}

		return result;
	}
}