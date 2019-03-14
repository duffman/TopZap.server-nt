"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PLogger {
    static log(prefix, label, data) {
        console.log(prefix + " :: " + label, data);
    }
    static out(label, data) {
        PLogger.log("OUT", label, data);
    }
    static debug(label, data) {
        PLogger.log("DEBUG", label, data);
    }
    static error(label, data) {
        PLogger.log("ERROR", label, data);
    }
}
exports.PLogger = PLogger;
