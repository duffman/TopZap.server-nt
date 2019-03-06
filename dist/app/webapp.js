'use strict';var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==='object'&&typeof Reflect.decorate==='function')r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r;};var __metadata=this&&this.__metadata||function(k,v){if(typeof Reflect==='object'&&typeof Reflect.metadata==='function')return Reflect.metadata(k,v);};Object.defineProperty(exports,'__esModule',{value:true});require('reflect-metadata');const kernel_config_1=require('../kernel.config');const inversify_1=require('inversify');const express=require('express');const expressSession=require('express-session');const redis=require('redis');const cors=require('cors');const bodyParser=require('body-parser');const express_1=require('express');const app_settings_1=require('./app.settings');const cli_logger_1=require('./cli/cli.logger');const scaledrone_client_1=require('./pubsub/scaledrone-service/scaledrone-client');const channel_config_1=require('./pubsub/scaledrone-service/channel-config');const drone_events_1=require('./pubsub/scaledrone-service/drone-events');const cli_config_file_1=require('./cli/cli.config-file');let RedisConnector=require('connect-redis')(expressSession);let WebApp=class WebApp{constructor(){this.webRoutes=express_1.Router();let configFile=new cli_config_file_1.CliConfigFile();let config=configFile.getConfig();let listenHost=config.listenHost?config.listenHost:'127.0.0.1';let listenPort=config.listenPort?config.listenPort:8081;cli_logger_1.Logger.logPurple('* Listen Host ::',listenHost);cli_logger_1.Logger.logPurple('* Listen Port ::',listenPort);this.settings=new app_settings_1.AppSettings(listenHost,listenPort,config.cors.credentials,config.cors.origin);}getAppVersion(){return'0.7.0';}getSecret(){return'!1gulka9n';}haltProcess(code=200){process.exit(code);}initApp(){let scope=this;this.restControllers=new Array();this.app=express();let listenHost=this.settings.listenHost;let listenPort=this.settings.listenPort;let redisClient=redis.createClient();let redisConnection={host:'localhost',port:6379,client:redisClient,ttl:260};let redisStore=new RedisConnector(redisConnection);let expDate=new Date(Date.now()+9000000);this.webRoutes.use(expressSession({secret:'1g#ulka9n!',store:redisStore,cookie:{maxAge:18000*10000,expires:expDate},saveUninitialized:true,resave:true}));cli_logger_1.Logger.logPurple('this.settings ::',this.settings);let corsOptions={credentials:this.settings.corsCredentials,origin:this.settings.corsOrigin};this.app.use(cors(corsOptions));this.webRoutes.use(bodyParser.json());this.webRoutes.use(bodyParser.urlencoded({extended:true}));this.webRoutes.all('*',(req,resp,next)=>{console.log('Request With Session ID ::',req.session.id);const PROP_HEADER='X-Zapped';if(req.session.zapped){resp.setHeader(PROP_HEADER,true);}else{req.session.zapped=true;resp.setHeader(PROP_HEADER,false);}next();});this.app.use(this.webRoutes);let client=new scaledrone_client_1.ScaledroneClient(channel_config_1.ChannelNames.Service);let channel=client.subscribe('register');let mess={mess:'kalle'};channel.on(drone_events_1.DroneEvents.Open,error=>{cli_logger_1.Logger.logPurple('Service Channel Open ::',error);});channel.on(drone_events_1.DroneEvents.Data,data=>{cli_logger_1.Logger.logPurple('Service Channel Data ::',data);});this.initRestControllers();this.server=this.app.listen(listenPort,listenHost,()=>{cli_logger_1.Logger.logPurple('Web Server is listening on port ::','');});}initRestControllers(){const routes=this.webRoutes;const controllers=this.restControllers;let injectedControllers=kernel_config_1.kernel.getAllTagged(kernel_config_1.Interface.RestApiController,kernel_config_1.Tag.Handler,kernel_config_1.Tag.ApiController);console.log('initRestControllers :: INJECTED ::',injectedControllers.length);for(let controller of injectedControllers){controllers.push(controller);controller.initRoutes(routes);}}};WebApp=__decorate([inversify_1.injectable(),__metadata('design:paramtypes',[])],WebApp);exports.WebApp=WebApp;