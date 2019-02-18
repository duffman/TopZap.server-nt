"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Server Session Middleware
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ZynSession {
    initRoutes(routes) {
        let scope = this;
        routes.use("/*", (req, resp, next) => {
            /*if (typeof req.session.views !== 'undefined') {
                console.log(req.cookies['connect.sid']);
            }

            console.log("req.session.views ::", req.session.views);
            */
            next(); // Call the next middleware
        });
    }
}
exports.ZynSession = ZynSession;
