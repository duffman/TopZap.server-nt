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
const inversify_1 = require("inversify");
const express = require("express");
const expressSession = require("express-session");
const redis = require("redis");
const bodyParser = require("body-parser");
const express_1 = require("express");
const product_api_controller_1 = require("@api/product-api.controller");
const service_api_controller_1 = require("@api/service-api.controller");
const bids_api_controller_1 = require("@api/bids-api.controller");
const captcha_controller_1 = require("@api/captcha.controller");
const app_settings_1 = require("@app/app.settings");
const putte_controller_1 = require("@api/putte.controller");
const cli_logger_1 = require("@cli/cli.logger");
const drone_api_controller_1 = require("@app/pubsub/zapdrone-service/drone.api-controller");
let RedisConnector = require("connect-redis")(expressSession);
let WebApp = class WebApp {
    constructor(settings) {
        this.settings = settings;
        this.webRoutes = express_1.Router();
        if (!settings) {
            //throw new Error("WebApp Settings Missing!");
            settings = new app_settings_1.AppSettings("127.0.0.1", 8080);
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
        //
        // Create new redis store.
        //
        let redisClient = redis.createClient();
        let redisConnection = { host: 'localhost', port: 6379, client: redisClient, ttl: 260 };
        let redisStore = new RedisConnector(redisConnection);
        this.webRoutes.use(expressSession({
            secret: "1g#ulka9n!",
            store: redisStore,
            saveUninitialized: true,
            resave: true // <- Update the session even if the request does not "touch" the session
        }));
        //this.app.use(bodyParser.json());
        //this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(this.webRoutes);
        cli_logger_1.Logger.logPurple("LISTEN HOST ::", listenHost);
        cli_logger_1.Logger.logPurple("LISTEN PORT ::", listenPort);
        //cors({credentials: true, withCredentials: true, origin: true});
        //this.app.use(cors());
        //this.webRoutes.use(session(sessData));
        this.webRoutes.use((req, res, next) => {
            let origin = req.headers['origin'] || req.headers['Origin'];
            let or = origin ? origin.toString() : "";
            res.header('Access-Control-Allow-Credentials', "true");
            res.header('Access-Control-Allow-Origin', or); //req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        });
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
        controllers.push(new drone_api_controller_1.DroneApiController());
        controllers.push(new putte_controller_1.PutteController());
        controllers.push(new captcha_controller_1.CaptchaController());
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
};
WebApp = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object])
], WebApp);
exports.WebApp = WebApp;
