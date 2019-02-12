/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as express               from "express";
import { NextFunction, Router }   from "express";
import * as fs                    from 'fs';
import * as bodyParser            from "body-parser";
import * as cookieParser          from "cookie-parser";
import * as session               from "express-session";
import * as cors                  from "cors";
import { DbManager }              from "@putteDb/db-kernel";
import { Logger }                 from "@cli/cli.logger";
import { ProductDb }              from "@db/product-db";
import { IRestApiController }     from "@api/api-controller";
import { ServiceApiController }   from "@api/service-api.controller";
import { IZappyApp }              from "@app/zappy.app";
import { ProductApiController }   from "@api/product-api.controller";
import { Settings }               from '@app/zappy.app.settings';
import * as path                  from 'path';
import { BidsApiController }      from '@api/bids-api.controller';

export class ZapApp implements IZappyApp {
	static developmentMode = false;

	debugMode: boolean = false;
	restControllers: IRestApiController[];

	webApp: express.Application;
	webRoutes: Router = Router();
	sessionMiddleware: any;

	db: DbManager;
	productDb: ProductDb;

	version: string = "1.6.5";

	getAppVersion(): string {
		return "ZapApp-Node-API/" + this.version;
	}

	getSecret(): string {
		return "ZapApp-Node-API/WillyW0nka";
	}

	constructor(public port: number, public includeMinerApi: boolean = false) {
		this.restControllers = new Array<IRestApiController>();

		this.webApp = express();
		this.sessionMiddleware = session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }});

		cors({credentials: true, origin: true});
		this.webApp.use(cors());

		let sessionSettings = {
			secret: "TopZap",
			cookie: { maxAge: 60000 }
		};

		let http = require("http").Server(this.webApp);
		let dbManager = new DbManager();

		let sessionMiddleware = session(sessionSettings);
		this.webApp.use(sessionMiddleware);

		this.webApp.use(this.webRoutes);

		this.configureWebServer2();
		this.initRestControllers();

		this.port = 3000;

		Logger.logPurple(`Starting Server on Port ${this.port}`);

		http.listen(this.port);
	}

	private init(): void {
		const routes = this.webRoutes;

		routes.get("/test", function(req, res) {
			console.log("TypeOf Session ::", typeof req.session);

			if (req.session.basket) {
				req.session.basket.itemCount++
				res.setHeader('Content-Type', 'text/html')
				res.write('<p>views: ' + req.session.basket.itemCount + '</p>')
				res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
				res.end()
			} else {
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

		this.webApp.use('/static', express.static(path.join(__dirname, 'public')))

		this.webApp.get('/res/:filename', (req, res) => {
			let filename = req.params.code;
			console.log("Get file", filename);
		});
	}

	private initRestControllers() {
		const routes = this.webRoutes;
		const controllers = this.restControllers;

		controllers.push(new BidsApiController());
		controllers.push(new ServiceApiController(this.debugMode));
		controllers.push(new ProductApiController(this.debugMode));

		//
		// Pass the Route object to each controller to assign routes
		//
		for (let index in controllers) {
			let controller = controllers[index];
			controller.initRoutes(routes);
		}
	}

	private configureWebServer2(): void {
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

	private configureWebServer(): void {
		let routes = this.webRoutes;

		// set the view engine to ejs
		this.webApp.set('view engine', 'ejs');

		function genuuid(): string {
			console.log("Generate ID::::");
			return "uidSafe(18)";
		}

		routes.use(this.sessionMiddleware);

		routes.use(cookieParser(Settings.sessionSecret));
		routes.use(bodyParser.json()); // support json encoded bodies
		routes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

		let allowCrossDomain = (req, res, next) => {
			//let origin = req.headers['origin'] || req.headers['Origin'];
			//let or: string = origin.toString();
			//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			//res.header("Access-Control-Allow-Credentials", "true");

			res.header("Access-Control-Allow-Origin", Settings.allowedCORSOrigins);
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

	private setErrorMiddleware(){
		//
		// Error middleware
		//
		if (ZapApp.developmentMode) {
			this.webApp.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.render('error', {
					message: err.message,
					error: err
				});
			});

		} else {
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
/*
if (CliCommander.debug()) {
	console.log("OUTSIDE CODE EXECUTING");
	let minerApi = true;
	let app = new ZapApp(minerApi);
}
*/