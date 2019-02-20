/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { injectable }             from "inversify";
import * as express               from "express";
import * as expressSession        from "express-session";
import * as redis                 from "redis";
import * as cors                  from "cors";
import * as bodyParser            from "body-parser";
import * as cookieParser          from "cookie-parser";
import { Router }                 from "express";
import { NextFunction }           from "express";

import { ProductApiController }   from "@api/product-api.controller";
import { ServiceApiController }   from "@api/service-api.controller";
import { BidsApiController }      from "@api/bids-api.controller";
import { IRestApiController }     from "@api/api-controller";
import { CaptchaController }      from "@api/captcha.controller";


import { IAppSettings }           from "@app/app.settings";
import { AppSettings }            from "@app/app.settings";
import { PutteController }        from "@api/putte.controller";
import { PVarUtils }              from "@putte/pvar-utils";
import { Logger }                 from "@cli/cli.logger";
import { DroneApiController } from "@app/pubsub/zapdrone-service/drone.api-controller";

let RedisConnector = require("connect-redis")(expressSession);

/*
let sessData = {
	resave: true,
	saveUninitialized: true,
	secret: 'XCR3rsasa%RDHHH',
	cookie: {
		maxAge: 960000
	}
};
*/

export interface IWebApp {
	debugMode: boolean;
}

@injectable()
export class WebApp implements IWebApp {
	debugMode: boolean;
	version: string;
	app: express.Application;
	server: any;
	restControllers: IRestApiController[];

	webRoutes: Router = Router();

	public getAppVersion(): string {
		return "0.7.0";
	}

	public getSecret(): string {
		return "!1gulka9n";
	}

	private haltProcess(code: number = 200) {
		process.exit(code);
	}

	constructor(public settings: IAppSettings) {
		if (!settings) {
			//throw new Error("WebApp Settings Missing!");


			settings = new AppSettings("127.0.0.1", 8080);

		}

		this.restControllers = new Array<IRestApiController>();
		this.app = express();

		this.initApp();
	}

	private initApp() {
		let scope = this;
		let listenHost = this.settings.listenHost;
		let listenPort = this.settings.listenPort;

		//
		// Create new redis store.
		//
		let redisClient  = redis.createClient();
		let redisConnection = { host: 'localhost', port: 6379, client: redisClient,ttl :  260 };
		let redisStore = new RedisConnector(redisConnection);

		this.webRoutes.use(expressSession({
			secret: "1g#ulka9n!",
			store: redisStore,
			saveUninitialized: true, // <- Create new session even if the request does not "touch" the session
			resave: true             // <- Update the session even if the request does not "touch" the session
		}));

		//this.app.use(bodyParser.json());
		//this.app.use(bodyParser.urlencoded({extended: true}));

		this.app.use(this.webRoutes);

		Logger.logPurple("LISTEN HOST ::", listenHost);
		Logger.logPurple("LISTEN PORT ::", listenPort);

		//cors({credentials: true, withCredentials: true, origin: true});
		//this.app.use(cors());
		//this.webRoutes.use(session(sessData));

		this.webRoutes.use((req, res, next) => {
			let origin = req.headers['origin'] || req.headers['Origin'];
			let or: string = origin ? origin.toString() : "";

			res.header('Access-Control-Allow-Credentials', "true");
			res.header('Access-Control-Allow-Origin', or); //req.headers.origin);
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
			next();
		});

		//this.webRoutes.use(cookieParser()); <-- interferes with exoressSession
		this.webRoutes.use(bodyParser.json()); // support json encoded bodies
		this.webRoutes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

		this.webRoutes.all('*', (req: any, resp: any, next: any) => {
			console.log('Request With Session ID ::', req.session.id);

			// IMPORTANT!!!!!!
			// Setting a property will automatically cause a Set-Cookie response,
			// so touch the header so the session cookie will be set on the client
			//
			const PROP_HEADER = "X-Zapped";

			if (req.session.zapped) {
				resp.setHeader(PROP_HEADER, true);
			} else {
				req.session.zapped = true;
				resp.setHeader(PROP_HEADER, false);
			}

			next();
		});

		//
		// Initialize API Controllers
		//
		this.initRestControllers();

		this.server = this.app.listen(listenPort,  listenHost,  () => {
			Logger.logPurple("Web Server is listening on port ::", "");
		});
	}

	private initRestControllers() {
		const routes = this.webRoutes; //webRoutes;
		const controllers = this.restControllers;

		controllers.push(new BidsApiController());
		controllers.push(new DroneApiController());
		controllers.push(new PutteController());
		controllers.push(new CaptchaController());
		controllers.push(new ServiceApiController());
		controllers.push(new ProductApiController());

		//
		// Pass the Route object to each controller to assign routes
		//
		for (let index in controllers) {
			let controller = controllers[index];
			controller.initRoutes(routes);
		}
	}
}
