"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_session_engine_1 = require("@components/session-igniter/mysql-session-engine");
const cli_logger_1 = require("@cli/cli.logger");
class SessionIgniter {
    constructor() {
        // This should be made in a dynamic manner, right now as of Jan 14 2019 I don´t have time
        // right now my account balance is zero, mark the balance next time I see this...then evaluate if it´s worth it...
        this.engine = new mysql_session_engine_1.MysqlSessionEngine();
    }
    set(sessionId, data) {
        return new Promise((resolve, reject) => {
            return this.engine.setData(sessionId, data);
        });
    }
    setEntry(sessionId, entry) {
        return new Promise((resolve, reject) => {
            return this.engine.setData(sessionId, entry).then(res => {
                resolve(res !== null);
            }).catch(err => {
                // Let this one pass
                resolve(false);
                cli_logger_1.Logger.logAppError(this, "setEntry", err);
            });
        });
    }
    get(sessionId, autoCreate = true) {
        return new Promise((resolve, reject) => {
            return this.engine.getData(sessionId, autoCreate);
        });
    }
}
exports.SessionIgniter = SessionIgniter;
