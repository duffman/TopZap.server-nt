"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const log = console.log;
class DBLogger {
    static logErrorMessage(errorMessage, error = null) {
        if (error == null)
            log(this.error(errorMessage));
        else
            log(this.error(errorMessage), error);
    }
}
DBLogger.error = chalk_1.default.bold.red;
DBLogger.warning = chalk_1.default.bold.yellow;
exports.DBLogger = DBLogger;
