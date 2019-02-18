"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cli_logger_1 = require("@cli/cli.logger");
const fs = require("fs");
class CliConfigFile {
    constructor() { }
    getConfig(configFilename = "/app.config.json") {
        let result = {};
        let configFile = __dirname + configFilename;
        cli_logger_1.Logger.logPurple("Reading config file ::", configFile);
        try {
            if (fs.existsSync(configFile)) {
                let contents = fs.readFileSync(configFile, "utf8");
                result = JSON.parse(contents);
            }
        }
        catch (ex) {
            cli_logger_1.Logger.logError("Error parsing config file ::", ex);
        }
        return result;
    }
}
exports.CliConfigFile = CliConfigFile;
