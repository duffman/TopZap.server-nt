/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


import * as http                  from "http";
import * as https                 from "https";
import * as express               from "express";
import * as session               from "express-session";
import * as cors                  from "cors";
import * as bodyParser            from "body-parser";
import * as cookieParser          from "cookie-parser";
import {NextFunction, Router} from 'express';
import { ProductApiController }   from '@api/product-api.controller';
import { ServiceApiController }   from '@api/service-api.controller';
import { BidsApiController }      from '@api/bids-api.controller';
import { IRestApiController}      from '@api/api-controller';
import { IZapNode }              from '@app/app.interface';
import {AppSettings, IAppSettings} from '@app/app.settings';
import {PutteController} from '@api/putte.controller';
import {PVarUtils} from '@putte/pvar-utils';
import {Logger} from '@cli/cli.logger';
import {ErrorCodes} from '../global';

let sessData = {
	resave: true,
	saveUninitialized: true,
	secret: 'XCR3rsasa%RDHHH',
	cookie: {
		maxAge: 960000
	}
};

export class WebApp implements IZapNode {
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
		if (settings === null) {
			settings = new AppSettings();
		}

		//
		// Validate Config File
		//
		if (!PVarUtils.isNumber(settings.listenPort)) {
			Logger.logError(`Invalid Port Number`, settings.listenPort);
			this.haltProcess(ErrorCodes.INVALID_PARAMS);
		}

		this.restControllers = new Array<IRestApiController>();
		this.app = express();

		this.initApp();
	}

	private initApp() {
		let scope = this;
		let listenHost = this.settings.listenHost;
		let listenPort = this.settings.listenPort;

		this.app.use(this.webRoutes);

		Logger.logPurple("LISTEN HOST ::", listenHost);
		Logger.logPurple("LISTEN PORT ::", listenPort);

		//cors({credentials: true, withCredentials: true, origin: true});
		//this.app.use(cors());

		this.webRoutes.use(session(sessData));

		this.webRoutes.use((req, res, next) => {
			let origin = req.headers['origin'] || req.headers['Origin'];
			let or: string = origin.toString();

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

		this.server = this.app.listen(listenPort,  listenHost,  () => {
			Logger.logPurple("Web Server is listening on port ::", "");
		});
	}

	private initRestControllers() {
		const routes = this.webRoutes; //webRoutes;
		const controllers = this.restControllers;

		controllers.push(new BidsApiController());
		controllers.push(new PutteController());
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
