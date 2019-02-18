"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PutteController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
    }
    initRoutes(routes) {
        routes.all("/putte", this.apiTest.bind(this));
    }
    apiTest(req, resp) {
        let testResp = {
            sessId: req.session.id
        };
        resp.json(testResp);
    }
}
exports.PutteController = PutteController;
let test = {
    data: {
        code: "348950"
    }
};
console.log("TESTJSON ::", JSON.stringify(test));
