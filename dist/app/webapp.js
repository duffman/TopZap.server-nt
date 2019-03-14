"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const kernel_config_1 = require("@root/kernel.config");
const inversify_1 = require("inversify");
const express = require("express");
const expressSession = require("express-session");
const redis = require("redis");
const cors = require("cors");
const bodyParser = require("body-parser");
const express_1 = require("express");
const app_settings_1 = require("@app/app.settings");
const cli_logger_1 = require("@cli/cli.logger");
const cli_config_file_1 = require("@cli/cli.config-file");
let RedisConnector = require("connect-redis")(expressSession);
let WebApp = class WebApp {
    constructor() {
        this.webRoutes = express_1.Router();
        let configFile = new cli_config_file_1.CliConfigFile();
        let config = configFile.getConfig();
        let listenHost = config.listenHost ? config.listenHost : "127.0.0.1";
        let listenPort = config.listenPort ? config.listenPort : 8081;
        cli_logger_1.Logger.logPurple("* Listen Host ::", listenHost);
        cli_logger_1.Logger.logPurple("* Listen Port ::", listenPort);
        this.settings = new app_settings_1.AppSettings(listenHost, listenPort, config.cors.credentials, config.cors.origin, config.useOldCors);
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
    setCors() {
        let corsOptions = {
            credentials: this.settings.corsCredentials,
            origin: this.settings.corsOrigin
        };
        this.app.use(cors(corsOptions));
    }
    setOldCors() {
        this.webRoutes.use((req, res, next) => {
            let origin = req.headers['origin'] || req.headers['Origin'];
            let or = origin ? origin.toString() : "*";
            res.header('Access-Control-Allow-Credentials', "true");
            res.header('Access-Control-Allow-Origin', or); //req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        });
        this.webRoutes.use(bodyParser.json()); // support json encoded bodies
        this.webRoutes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    }
    initApp() {
        let scope = this;
        this.restControllers = new Array();
        this.app = express();
        let listenHost = this.settings.listenHost;
        let listenPort = this.settings.listenPort;
        //
        // Create new redis store.
        //
        let redisClient = redis.createClient();
        let redisConnection = { host: 'localhost', port: 6379, client: redisClient, ttl: 260 };
        let redisStore = new RedisConnector(redisConnection);
        let expDate = new Date(Date.now() + 9000000);
        this.webRoutes.use(expressSession({
            secret: "1g#ulka9n!",
            store: redisStore,
            cookie: {
                maxAge: 18000 * 10000,
                expires: expDate
            },
            saveUninitialized: true,
            resave: true // <- Update the session even if the request does not "touch" the session
        }));
        //this.app.use(bodyParser.json());
        //this.app.use(bodyParser.urlencoded({extended: true}));
        cli_logger_1.Logger.logPurple("this.settings ::", this.settings);
        let corsOptions = {
            credentials: this.settings.corsCredentials,
            origin: this.settings.corsOrigin
        };
        this.app.use(cors(corsOptions));
        /*
        this.app.use((req, res, next) => {
            let origin = req.headers['origin'] || req.headers['Origin'];
            let or: string = origin ? origin[0] : "*";

            let origins = ["http://localhost:4200", "*", or];

            res.setHeader('Access-Control-Allow-Origin',       "http://localhost:4200"); // req.headers.origin);
            res.setHeader('Access-Control-Allow-Credentials',  "true");
            res.setHeader('Access-Control-Allow-Methods',      "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader('Access-Control-Allow-Headers',      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

            next();
        });
        */
        //this.webRoutes.use(cookieParser()); <-- interferes with exoressSession
        this.webRoutes.use(bodyParser.json()); // support json encoded bodies
        this.webRoutes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        this.webRoutes.all('*', (req, resp, next) => {
            console.log('Request With Session ID ::', req.session.id);
            // IMPORTANT!!!!!!
            // Setting a property will automatically cause a Set-Cookie response,
            // so touch the header so the session cookie will be set on the client
            //
            const PROP_HEADER = "X-Zapped";
            if (req.session.zapped) {
                resp.setHeader(PROP_HEADER, true);
            }
            else {
                req.session.zapped = true;
                resp.setHeader(PROP_HEADER, false);
            }
            next();
        });
        //
        this.app.use(this.webRoutes);
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
        let injectedControllers = kernel_config_1.kernel.getAllTagged(kernel_config_1.Interface.RestApiController, kernel_config_1.Tag.Handler, kernel_config_1.Tag.ApiController);
        console.log("initRestControllers :: INJECTED ::", injectedControllers.length);
        for (let controller of injectedControllers) {
            controllers.push(controller);
            controller.initRoutes(routes);
        }
    }
};
WebApp = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], WebApp);
exports.WebApp = WebApp;
