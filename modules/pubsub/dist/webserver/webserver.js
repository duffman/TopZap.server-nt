"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
//var express = require('express');
var redis = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var client = redis.createClient();
var app = express();
// var oneDay = 86400;
app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
    saveUninitialized: false,
    resave: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, resp) => {
    console.log("GET!!");
    if (req.mySession.seenyou) {
        res.setHeader('X-Seen-You', 'true');
    }
    else {
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
app.listen(3000, function () {
    console.log("App Started on PORT 3000");
});
