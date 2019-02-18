"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express_1 = require("express");
const product_api_controller_1 = require("@api/product-api.controller");
const service_api_controller_1 = require("@api/service-api.controller");
const bids_api_controller_1 = require("@api/bids-api.controller");
const app_settings_1 = require("@app/app.settings");
const putte_controller_1 = require("@api/putte.controller");
const pvar_utils_1 = require("@putte/pvar-utils");
const cli_logger_1 = require("@cli/cli.logger");
const global_1 = require("../global");
let sessData = {
    resave: true,
    saveUninitialized: true,
    secret: 'XCR3rsasa%RDHHH',
    cookie: {
        maxAge: 960000
    }
};
class WebApp {
    constructor(settings) {
        this.settings = settings;
        this.webRoutes = express_1.Router();
        if (settings === null) {
            settings = new app_settings_1.AppSettings();
        }
        //
        // Validate Config File
        //
        if (!pvar_utils_1.PVarUtils.isNumber(settings.listenPort)) {
            cli_logger_1.Logger.logError(`Invalid Port Number`, settings.listenPort);
            this.haltProcess(global_1.ErrorCodes.INVALID_PARAMS);
        }
        this.restControllers = new Array();
        this.app = express();
        this.initApp();
    }
    getAppVersion() {
        return "0.7.0";
    }
    getSecret() {
        return "!1gulka9n";
    }
    haltProcess(code = 200) {
        process.exit(code);
    }
    initApp() {
        let scope = this;
        let listenHost = this.settings.listenHost;
        let listenPort = this.settings.listenPort;
        this.app.use(this.webRoutes);
        cli_logger_1.Logger.logPurple("LISTEN HOST ::", listenHost);
        cli_logger_1.Logger.logPurple("LISTEN PORT ::", listenPort);
        //cors({credentials: true, withCredentials: true, origin: true});
        //this.app.use(cors());
        this.webRoutes.use(session(sessData));
        this.webRoutes.use((req, res, next) => {
            let origin = req.headers['origin'] || req.headers['Origin'];
            let or = origin.toString();
            res.header('Access-Control-Allow-Credentials', "true");
            res.header('Access-Control-Allow-Origin', or); //req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        });
        this.webRoutes.use(cookieParser());
        this.webRoutes.use(bodyParser.json()); // support json encoded bodies
        this.webRoutes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        this.webRoutes.all('*', (req, resp, next) => {
            console.log('Request With Session ID ::', req.session.id);
            next();
        });
        //
        // Initialize API Controllers
        //
        this.initRestControllers();
        this.server = this.app.listen(listenPort, listenHost, () => {
            cli_logger_1.Logger.logPurple("Web Server is listening on port ::", "");
        });
    }
    initRestControllers() {
        const routes = this.webRoutes; //webRoutes;
        const controllers = this.restControllers;
        controllers.push(new bids_api_controller_1.BidsApiController());
        controllers.push(new putte_controller_1.PutteController());
        controllers.push(new service_api_controller_1.ServiceApiController());
        controllers.push(new product_api_controller_1.ProductApiController());
        //
        // Pass the Route object to each controller to assign routes
        //
        for (let index in controllers) {
            let controller = controllers[index];
            controller.initRoutes(routes);
        }
    }
}
exports.WebApp = WebApp;
