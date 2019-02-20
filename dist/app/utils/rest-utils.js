"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class RestUtils {
    static jsonSuccess(resp, success = true) {
        resp.json({ success: success });
    }
    static internalError(resp, message = "") {
        resp.writeHead(501, { 'Content-Type': 'text/plain' });
        resp.end(message);
    }
    static bogusError(resp, message = "") {
        resp.writeHead(501, { 'Content-Type': 'text/plain' });
        resp.end(message);
    }
}
exports.RestUtils = RestUtils;
