"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
const session_basket_1 = require("@zapModels/session-basket");
class SessionEntry {
    constructor(id, data = null, created = new Date()) {
        this.id = id;
        this.data = data;
    }
}
exports.SessionEntry = SessionEntry;
class SessionManager {
    constructor() {
        this.sessionData = new Array();
    }
    getSession(id, autoCreate = true) {
        let result = null;
        for (const entry of this.sessionData) {
            if (entry.id === id) {
                result = entry;
                break;
            }
        }
        if (result === null && autoCreate) {
            result = new SessionEntry(id);
            this.sessionData.push(result);
        }
        return result;
    }
    setSessionData(id, data = null) {
        let entry = this.getSession(id);
        if (entry === null) {
            entry = new SessionEntry(id, data);
            this.sessionData.push(entry);
        }
        else {
            entry.data = data;
        }
        return entry;
    }
    getSessionBasket(sessId) {
        let sessEntry = this.getSession(sessId);
        if (sessEntry.data === null) {
            sessEntry.data = new session_basket_1.SessionBasket();
            //this.setSessionData(sessId, sessEntry.vendorBaskets); //??? Are we operating on the pointer or do we REALLY need this???
        }
        return sessEntry.data;
    }
}
exports.SessionManager = SessionManager;
