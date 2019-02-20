"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Timestamp {
    /**
     * Return current UNIX
     * @returns {number}
     */
    static UNIX() {
        return Math.round((new Date()).getTime() / 1000);
    }
}
exports.Timestamp = Timestamp;
