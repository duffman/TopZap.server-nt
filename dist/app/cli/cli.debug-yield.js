"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cli_logger_1 = require("@cli/cli.logger");
const cli_error_codes_1 = require("@cli/cli.error-codes");
class CliDebugYield {
    static fatalError(message, err, die = false) {
        let jsonErr = JSON.stringify(err);
        cli_logger_1.Logger.logFatalError(message, new Error(jsonErr));
        if (die) {
            process.exit(cli_error_codes_1.CliErrorCodes.FATAL_ERROR);
        }
    }
}
exports.CliDebugYield = CliDebugYield;
