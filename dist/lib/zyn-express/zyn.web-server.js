"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ZynWebServer {
    constructor() {
        this.routes = express_1.Router();
    }
    init(useCoors) {
        if (useCoors) {
            this.routes.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });
        }
        let result = true;
        /*
        http.createServer((request, respone) = {
            respone.writeHead(200, {'Content-type':'text/plan'});
            response.write('Hello Node JS Server Response');
            response.end( );

        }).listen(7000);
        */
        return result;
    }
}
exports.ZynWebServer = ZynWebServer;
/*
        this.webApp.on("error", ni);

this.webApp.on("error", function onError(error) {
            if (error.syscall !== "listen") {
                throw error;
            }

            var bind = typeof port === "string"
                ? "Pipe " + port
                : "Port " + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case "EACCES":
                    console.error(bind + " requires elevated privileges");
                    process.exit(1);
                    break;
                case "EADDRINUSE":
                    console.error(bind + " is already in use");
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

 */
