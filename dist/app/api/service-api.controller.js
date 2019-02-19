"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceApiController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
    }
    getToken(req, resp) {
        resp.json({ token: req.session.id });
    }
    initRoutes(routes) {
        let scope = this;
        routes.all("/token", this.getToken.bind(this));
    }
}
exports.ServiceApiController = ServiceApiController;
