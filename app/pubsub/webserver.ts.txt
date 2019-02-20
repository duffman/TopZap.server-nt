/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

//var express = require('express');
//var redis   = require("redis");
//var session = require('express-session');


import { ZapdroneSettings } from "@pubsub/zapdrone.settings";
import * as express from "express"
import * as redis from "redis";
import * as expressSession from "express-session";
let RedisConnector = require('connect-redis')(expressSession);

let bodyParser = require('body-parser');
let redisClient  = redis.createClient();


export interface IDroneWebServer {
}


export class DroneWebServer implements IDroneWebServer {
	app: express.Application;

	constructor() {}

	private initSession() {
		this.app = express();

		//
		// Create new redis store.
		//
		let redisConnection = { host: 'localhost', port: 6379, client: redisClient,ttl :  260 };
		let redisStore = new RedisConnector(redisConnection);

		this.app.use(expressSession({
			secret: ZapdroneSettings.SessionSecret,
			store: redisStore,
			saveUninitialized: false,
			resave: false
		}));

		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({extended: true}));

		this.startServer();
	}

	public startServer() {
		this.app.listen(ZapdroneSettings.DroneWebServerPort,function(){
			console.log("App Started on PORT 3000");
		});
	}
}



// var oneDay = 86400;



/*


app.get("/", (req: Request, resp) => {
	console.log("GET!!");

	if (req.mySession.seenyou) {
		res.setHeader('X-Seen-You', 'true');
	} else {
		// setting a property will automatically cause a Set-Cookie response
		req.mySession.seenyou = true;
		res.setHeader('X-Seen-You', 'false');
	}




	let data = {
		id: req.session.id,
		raw: req.session
	};

	resp.json(data);
});


app.get('/kuk', (req, resp) => {
	console.log("GET!!");

	let data = {
		ballen: "rullar"
	};

	let data2 = {
		jag: "ska",
		knulla: "dig",
		i: "röven",
		mot: "betalning"
	};

	req.session.data = data;
	req.session.rullstrut = data2;

	resp.json(data);
});


app.get('/kuk2', (req, resp) => {

	console.log("Hämtar Rullstrut");
	resp.json(req.session.rullstrut);


});


	*/