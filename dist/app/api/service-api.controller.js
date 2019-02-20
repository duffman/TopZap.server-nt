"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const api_routes_1 = require("@app/settings/api-routes");
class ServiceApiController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
    }
    getToken(req, resp) {
        resp.json({ token: req.session.id });
    }
    apiGetSessionData(req, resp, next) {
        let responseData = {
            key: req.session.id
        };
        resp.json(responseData);
        next();
    }
    initRoutes(routes) {
        let scope = this;
        routes.all("/token", this.getToken.bind(this));
        routes.all(api_routes_1.ApiRoutes.Service.GET_SESSION_INFO, this.apiGetSessionData.bind(this));
    }
}
exports.ServiceApiController = ServiceApiController;
