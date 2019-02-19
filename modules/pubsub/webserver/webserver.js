"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */
exports.__esModule = true;
var express = require("express");
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
app.get('/', function (req, resp) {
    console.log("GET!!");
    var data = {
        id: req.session.id,
        raw: req.session
    };
    resp.json(data);
});
app.get('/kuk', function (req, resp) {
    console.log("GET!!");
    var data = {
        ballen: "rullar"
    };
    var data2 = {
        jag: "ska",
        knulla: "dig",
        i: "röven",
        mot: "betalning"
    };
    req.session.data = data;
    req.session.rullstrut = data2;
    resp.json(data);
});
app.get('/kuk2', function (req, resp) {
    console.log("Hämtar Rullstrut");
    resp.json(req.session.rullstrut);
});
app.listen(3000, function () {
    console.log("App Started on PORT 3000");
});
