'use strict';Object.defineProperty(exports,'__esModule',{value:true});const express=require('express');const expressSession=require('express-session');const redis=require('redis');const bodyParser=require('body-parser');const express_1=require('express');const product_api_controller_1=require('./api/product-api.controller');const service_api_controller_1=require('./api/service-api.controller');const bids_api_controller_1=require('./api/bids-api.controller');const captcha_controller_1=require('./api/captcha.controller');const app_settings_1=require('./app.settings');const putte_controller_1=require('./api/putte.controller');const pvar_utils_1=require('../lib/node-tsutils/pvar-utils');const cli_logger_1=require('./cli/cli.logger');const global_1=require('../global');let RedisConnector=require('connect-redis')(expressSession);class WebApp{constructor(settings){this.settings=settings;this.webRoutes=express_1.Router();if(settings===null){settings=new app_settings_1.AppSettings();}if(!pvar_utils_1.PVarUtils.isNumber(settings.listenPort)){cli_logger_1.Logger.logError(`Invalid Port Number`,settings.listenPort);this.haltProcess(global_1.ErrorCodes.INVALID_PARAMS);}this.restControllers=new Array();this.app=express();this.initApp();}getAppVersion(){return'0.7.0';}getSecret(){return'!1gulka9n';}haltProcess(code=200){process.exit(code);}initApp(){let scope=this;let listenHost=this.settings.listenHost;let listenPort=this.settings.listenPort;let redisClient=redis.createClient();let redisConnection={host:'localhost',port:6379,client:redisClient,ttl:260};let redisStore=new RedisConnector(redisConnection);this.webRoutes.use(expressSession({secret:'1g#ulka9n!',store:redisStore,saveUninitialized:false,resave:false}));this.app.use(this.webRoutes);cli_logger_1.Logger.logPurple('LISTEN HOST ::',listenHost);cli_logger_1.Logger.logPurple('LISTEN PORT ::',listenPort);this.webRoutes.use((req,res,next)=>{let origin=req.headers['origin']||req.headers['Origin'];let or=origin?origin.toString():'';res.header('Access-Control-Allow-Credentials','true');res.header('Access-Control-Allow-Origin',or);res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');res.header('Access-Control-Allow-Headers','X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');next();});this.webRoutes.use(bodyParser.json());this.webRoutes.use(bodyParser.urlencoded({extended:true}));this.webRoutes.all('*',(req,resp,next)=>{console.log('Request With Session ID ::',req.session.id);const PROP_HEADER='X-Zapped';if(req.ZSession.zapped){resp.setHeader(PROP_HEADER,true);}else{req.ZSession.zapped=true;resp.setHeader(PROP_HEADER,false);}next();});this.initRestControllers();this.server=this.app.listen(listenPort,listenHost,()=>{cli_logger_1.Logger.logPurple('Web Server is listening on port ::','');});}initRestControllers(){const routes=this.webRoutes;const controllers=this.restControllers;controllers.push(new bids_api_controller_1.BidsApiController());controllers.push(new putte_controller_1.PutteController());controllers.push(new captcha_controller_1.CaptchaController());controllers.push(new service_api_controller_1.ServiceApiController());controllers.push(new product_api_controller_1.ProductApiController());for(let index in controllers){let controller=controllers[index];controller.initRoutes(routes);}}}exports.WebApp=WebApp;