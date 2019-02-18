"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ZapResult {
    constructor(success = false, error = null) {
        this.success = success;
        this.error = error;
    }
}
exports.ZapResult = ZapResult;
