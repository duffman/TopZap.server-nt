"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SessionEntry {
    constructor(id, data = null, created = new Date()) {
        this.id = id;
        this.data = data;
    }
}
exports.SessionEntry = SessionEntry;
