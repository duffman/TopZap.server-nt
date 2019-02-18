"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_1 = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db_kernel_1 = require("@putteDb/db-kernel");
const cli_logger_1 = require("@cli/cli.logger");
const service_api_controller_1 = require("@api/service-api.controller");
const product_api_controller_1 = require("@api/product-api.controller");
const app_settings_1 = require("@app/app.settings");
const path = require("path");
const bids_api_controller_1 = require("@api/bids-api.controller");
class ZapApp {
    constructor(port, includeMinerApi = false) {
        this.port = port;
        this.includeMinerApi = includeMinerApi;
        this.debugMode = false;
        this.webRoutes = express_1.Router();
        this.version = "1.6.5";
        this.restControllers = new Array();
        this.webApp = express();
        //		cors({ credentials: true, origin: true });
        //		this.webApp.use(cors());
        const oneHour = 3600000;
        const diurnal = oneHour * 72;
        const monthHours = diurnal * 30;
        const expireTime = monthHours;
        let sessionSettings = {
            secret: "TopZap",
            maxAge: new Date(Date.now() + expireTime),
            expires: new Date(Date.now() + expireTime),
        };
        /*app.use(express.session({
            secret  : "Stays my secret",
            maxAge  : new Date(Date.now() + 3600000), //1 Hour
            expires : new Date(Date.now() + 3600000), //1 Hour
            store   : new MongoStore({ db: 'myDB' })
        }));*/
        //this.sessionMiddleware = session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }});
        let http = require("http").Server(this.webApp);
        let dbManager = new db_kernel_1.DbManager();
        let sessionMiddleware = session(sessionSettings);
        this.webApp.use(sessionMiddleware);
        this.webApp.use(this.webRoutes);
        this.configureWebServer2();
        this.initRestControllers();
        this.port = 3000;
        cli_logger_1.Logger.logPurple(`Starting Server on Port ${this.port}`);
        http.listen(this.port);
    }
    getAppVersion() {
        return "ZapApp-Node-API/" + this.version;
    }
    getSecret() {
        return "ZapApp-Node-API/WillyW0nka";
    }
    init() {
        const routes = this.webRoutes;
        routes.get("/test", function (req, res) {
            console.log("TypeOf Session ::", typeof req.session);
            if (req.session.basket) {
                req.session.basket.itemCount++;
                res.setHeader('Content-Type', 'text/html');
                res.write('<p>views: ' + req.session.basket.itemCount + '</p>');
                res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
                res.end();
            }
            else {
                req.session.basket = {
                    type: "basket",
                    itemCount: 0
                };
                res.end('welcome to the session demo. refresh! :: ' + req.session.basket.itemCount);
            }
        });
        // TODO: MOVE TO NGINX
        // Get Static file
        //
        this.webApp.use(express.static('public'));
        this.webApp.use("vendor", express.static("./public/images/vendors"));
        this.webApp.use("vendors", express.static("public/images/vendors"));
        this.webApp.use("vendors", express.static("public/images/vendors/"));
        this.webApp.use('/static', express.static(path.join(__dirname, 'public')));
        this.webApp.get('/res/:filename', (req, res) => {
            let filename = req.params.code;
            console.log("Get file", filename);
        });
    }
    initRestControllers() {
        const routes = this.webRoutes;
        const controllers = this.restControllers;
        controllers.push(new bids_api_controller_1.BidsApiController());
        controllers.push(new service_api_controller_1.ServiceApiController(this.debugMode));
        controllers.push(new product_api_controller_1.ProductApiController(this.debugMode));
        //
        // Pass the Route object to each controller to assign routes
        //
        for (let index in controllers) {
            let controller = controllers[index];
            controller.initRoutes(routes);
        }
    }
    configureWebServer2() {
        // set the view engine to ejs
        this.webApp.set('view engine', 'ejs');
        this.webApp.use(express.static('public'));
        this.webApp.use("images", express.static("public/images"));
        this.webApp.use('/static', express.static(path.join(__dirname, 'public')));
        let routes = this.webRoutes;
        routes.use(this.sessionMiddleware);
        routes.use(cookieParser());
        routes.use(bodyParser.json()); // support json encoded bodies
        routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        routes.use(function (err, req, res, next) {
            res.status(err.status || 500);
            let data = {
                "error": {
                    "message": "err.message",
                    "error": err
                }
            };
            res.json(data);
        });
    }
    configureWebServer() {
        let routes = this.webRoutes;
        // set the view engine to ejs
        this.webApp.set('view engine', 'ejs');
        function genuuid() {
            console.log("Generate ID::::");
            return "uidSafe(18)";
        }
        routes.use(this.sessionMiddleware);
        routes.use(cookieParser(app_settings_1.Settings.sessionSecret));
        routes.use(bodyParser.json()); // support json encoded bodies
        routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        let allowCrossDomain = (req, res, next) => {
            //let origin = req.headers['origin'] || req.headers['Origin'];
            //let or: string = origin.toString();
            //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            //res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Origin", app_settings_1.Settings.allowedCORSOrigins);
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        };
        routes.use(allowCrossDomain);
        routes.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: "err.message",
                error: {}
            });
        });
    }
    setErrorMiddleware() {
        //
        // Error middleware
        //
        if (ZapApp.developmentMode) {
            this.webApp.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }
        else {
            // production error handler
            // no stacktraces leaked to user
            this.webApp.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: {}
                });
            });
        }
    }
}
ZapApp.developmentMode = false;
exports.ZapApp = ZapApp;
/*
if (CliCommander.debug()) {
    console.log("OUTSIDE CODE EXECUTING");
    let minerApi = true;
    let app = new ZapApp(minerApi);
}
*/ 
