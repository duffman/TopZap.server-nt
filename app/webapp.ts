/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { Interface, kernel, Tag } from '@root/kernel.config';
import { injectable }             from "inversify";
import * as express               from "express";
import * as expressSession        from "express-session";
import * as redis                 from "redis";
import * as cors                  from "cors";
import * as bodyParser            from "body-parser";
import { Router }                 from "express";
import { IRestApiController }     from "@api/api-controller";
import { AppSettings }            from "@app/app.settings";
import { Logger }                 from "@cli/cli.logger";
import { CliConfigFile }          from '@cli/cli.config-file';

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
	initApp(): void;
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

	settings: AppSettings;

	constructor() {
		let configFile = new CliConfigFile();
		let config = configFile.getConfig();

		let listenHost = config.listenHost ? config.listenHost : "127.0.0.1";
		let listenPort = config.listenPort ? config.listenPort : 8081;

		Logger.logPurple("* Listen Host ::", listenHost);
		Logger.logPurple("* Listen Port ::", listenPort);

		this.settings = new AppSettings(
			listenHost,
			listenPort,
			config.cors.credentials,
			config.cors.origin,
			config.useOldCors
		);
	}

	private setCors() {
		let corsOptions = {
			credentials: this.settings.corsCredentials,
			origin: this.settings.corsOrigin
		};
		this.app.use(cors(corsOptions));
	}

	private setOldCors() {
		this.webRoutes.use((req, res, next) => {
			let origin = req.headers['origin'] || req.headers['Origin'];
			let or: string = origin ? origin.toString() : "*";

			res.header('Access-Control-Allow-Credentials', "true");
			res.header('Access-Control-Allow-Origin', or); //req.headers.origin);
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
			next();
		});

		this.webRoutes.use(bodyParser.json()); // support json encoded bodies
		this.webRoutes.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
	}

	public initApp(): void {
		let scope = this;

		this.restControllers = new Array<IRestApiController>();
		this.app = express();

		let listenHost = this.settings.listenHost;
		let listenPort = this.settings.listenPort;

		//
		// Create new redis store.
		//
		let redisClient  = redis.createClient();
		let redisConnection = { host: 'localhost', port: 6379, client: redisClient,ttl :  260 };
		let redisStore = new RedisConnector(redisConnection);

		let expDate = new Date(Date.now() + 9000000);

		this.webRoutes.use(expressSession({
			secret: "1g#ulka9n!",
			store: redisStore,
			cookie: {
				maxAge: 18000 * 10000,
				expires: expDate
			},
			saveUninitialized: true, // <- Create new session even if the request does not "touch" the session
			resave: true             // <- Update the session even if the request does not "touch" the session
		}));

		//this.app.use(bodyParser.json());
		//this.app.use(bodyParser.urlencoded({extended: true}));

		Logger.logPurple("this.settings ::", this.settings);

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

		this.app.use(this.webRoutes);


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
		const controllers: IRestApiController[] = this.restControllers;

		let injectedControllers = kernel.getAllTagged<IRestApiController>(
			Interface.RestApiController,
			Tag.Handler,
			Tag.ApiController
		);

		console.log("initRestControllers :: INJECTED ::", injectedControllers.length);

		for (let controller of injectedControllers) {
			controllers.push(controller);
			controller.initRoutes(routes);
		}
	}
}
