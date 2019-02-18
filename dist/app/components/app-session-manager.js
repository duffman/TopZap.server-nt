"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_basket_1 = require("@zapModels/session-basket");
const session_igniter_1 = require("@components/session-igniter/session-igniter");
const session_igniter_entry_1 = require("@components/session-igniter/session-igniter-entry");
const cli_logger_1 = require("@cli/cli.logger");
class AppSessionManager {
    constructor() {
        this.nodeStorage = false;
        // In V8 Memory - very very bad, only use while testing or when you fucked up the db
        if (this.nodeStorage) {
            this.sessionData = new Array();
        }
        else {
            this.sessIgnite = new session_igniter_1.SessionIgniter();
        }
    }
    getNodeStore(id, autoCreate = true) {
        let result = null;
        for (const entry of this.sessionData) {
            if (entry.id === id) {
                result = entry;
                break;
            }
        }
        if (result === null && autoCreate) {
            result = new session_igniter_entry_1.SessionEntry(id);
            this.sessionData.push(result);
        }
        return result;
    }
    getSession(id, autoCreate = true) {
        /*if (this.nodeStorage) {
            return new Promise((resolve, reject) => {
                let entry = this.getNodeStore(id, autoCreate);
                resolve(entry)
            }).catch(err => {
                Logger.logError("getSession :: nodeStorage :: ERROR ::", err);
            });
        }
        */
        return this.sessIgnite.get(id, autoCreate);
    }
    setSessionData(sessId, data = null) {
        return new Promise((resolve, reject) => {
            return this.getSession(sessId).then(entry => {
                entry.data = data;
                this.sessIgnite.setEntry(sessId, entry).then(res => {
                    resolve(entry);
                }).catch(err => {
                    cli_logger_1.Logger.logError("setSessionData :: setEntry ::", err);
                    resolve(null);
                });
            }).catch(err => {
                cli_logger_1.Logger.logError("setSessionData :: ERROR ::", err);
                reject(err);
            });
            /*
            if (entry === null) {
                entry = new SessionEntry(sessId, vendorBaskets);
                this.sessionData.push(entry);
            } else {
                entry.vendorBaskets = vendorBaskets;
            }

            return entry;
            */
        });
    }
    setSessionBasket(sessId, basket) {
        let entry = new session_igniter_entry_1.SessionEntry(sessId, basket);
        return new Promise((resolve, reject) => {
            return this.setSessionData(sessId, entry).then(res => {
            });
        });
    }
    getSessionBasket(sessId, autoCreate = true) {
        function saveBasket() {
            return new Promise((resolve, reject) => {
            });
        }
        return new Promise((resolve, reject) => {
            return this.getSession(sessId, autoCreate).then(sessEntry => {
                if (sessEntry.data === null) {
                    sessEntry.data = new session_basket_1.SessionBasket();
                    resolve(sessEntry.data);
                    //this.setSessionData(sessId, sessEntry.vendorBaskets); //??? Are we operating on the pointer or do we REALLY need this???
                }
            }).catch(err => {
                cli_logger_1.Logger.logError("getSessionBasket :: ERROR ::", err);
                reject(err);
            });
        });
    }
}
exports.AppSessionManager = AppSessionManager;
