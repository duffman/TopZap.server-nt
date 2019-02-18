"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ZynRouter {
    constructor(app) {
        this.app = app;
        this.debug();
    }
    debug() {
        this.app.routes("/zyn").get((req, res) => {
            res.status(200).send({
                message: "Zynaptic Web - debugMode response"
            });
        });
    }
    zynGet(name, req, res, next) {
        this.app.routes.get(name, req, res, next());
    }
    /*	public zynPost
        public zynPatch
        public zynPut
        public zynDelete
    */
    routerMiddleware() {
    }
}
