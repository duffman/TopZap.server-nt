'use strict';var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==='object'&&typeof Reflect.decorate==='function')r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r;};var __metadata=this&&this.__metadata||function(k,v){if(typeof Reflect==='object'&&typeof Reflect.metadata==='function')return Reflect.metadata(k,v);};var __param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex);};};Object.defineProperty(exports,'__esModule',{value:true});require('reflect-metadata');const inversify_1=require('inversify');const cli_logger_1=require('../cli/cli.logger');const rest_utils_1=require('../utils/rest-utils');const basket_service_1=require('../services/basket.service');const analytics_db_1=require('../../database/analytics-db');const api_routes_1=require('../settings/api-routes');const drone_bids_pipe_1=require('../pubsub/zapdrone-service/pipes/drone-bids-pipe');let BidsApiController=class BidsApiController{constructor(basketService,droneBidsPipe){this.basketService=basketService;this.droneBidsPipe=droneBidsPipe;this.analyticsDb=new analytics_db_1.AnalyticsDb();console.log('BidsApiController --- XXX');droneBidsPipe.startService(true);}apiGetBasket(req,resp){let data=req.body;let zsid=data.zsid;let sessId=req.session.id;console.log('apiGetBasket :: BODY ::',data);console.log('apiGetBasket :: ZSID ::',zsid);console.log('apiGetBasket :: sessId ::',sessId);this.basketService.getCurrentBasket(zsid).then(data=>{resp.json(data);}).catch(err=>{cli_logger_1.Logger.logError('apiGetBasket :: err ::',err);});}apiAddBasketItem(req,resp){let data=req.body;let code=data.code;let zsid=data.zsid;console.log('BIDS :: BODY ::',data);console.log('BIDS :: ZSID ::',zsid);console.log('BIDS :: CODE ::',code);let res=this.doGetBids(code,zsid);rest_utils_1.RestUtils.jsonSuccess(resp,res);}apiDeleteBasketItem(req,resp){let data=req.body;let code=data.code;let zsid=data.zsid;let sessId=req.session.id;console.log('REMOVING ITEM :: BODY ::',data);console.log('REMOVING ITEM :: ZSID ::',zsid);console.log('REMOVING ITEM :: CODE ::',code);this.basketService.removeItem(code,zsid).then(res=>{rest_utils_1.RestUtils.jsonSuccess(resp,true);}).catch(err=>{rest_utils_1.RestUtils.jsonError(resp);});}apiReviewBasket(req,resp){let data=req.body;let zsid=data.zsid;let sessId=req.session.id;console.log('BASKET :: SESSION ID ::',sessId);console.log('BASKET :: ZSID ::',zsid);this.basketService.getReviewData(zsid).then(res=>{console.log('apiReviewBasket ::',JSON.stringify(res));resp.json(res);}).catch(err=>{cli_logger_1.Logger.logError('apiReviewBasket :: err ::',err);});}initRoutes(routes){routes.post(api_routes_1.ApiRoutes.Basket.GET_BASKET,this.apiGetBasket.bind(this));routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_ADD,this.apiAddBasketItem.bind(this));routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_DELETE,this.apiDeleteBasketItem.bind(this));routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_REVIEW,this.apiReviewBasket.bind(this));}doGetBids(code,sessId){let result=true;try{cli_logger_1.Logger.log(`BasketChannelController :: doGetOffers`);this.droneBidsPipe.getBid(code,sessId);}catch(err){cli_logger_1.Logger.logError('doGetBids :: ERROR ::',err);result=false;}return result;}};BidsApiController=__decorate([inversify_1.injectable(),__param(0,inversify_1.inject('IBasketService')),__param(1,inversify_1.inject('IDroneBidsPipe')),__metadata('design:paramtypes',[basket_service_1.BasketService,drone_bids_pipe_1.DroneBidsPipe])],BidsApiController);exports.BidsApiController=BidsApiController;