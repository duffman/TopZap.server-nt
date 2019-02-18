"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ZynRequest {
    constructor(req, resp, next) {
        this.req = req;
        this.resp = resp;
        this.next = next;
        this.session = req.session;
    }
}
exports.ZynRequest = ZynRequest;
