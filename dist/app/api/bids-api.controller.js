'use strict';Object.defineProperty(exports,'__esModule',{value:true});const cli_logger_1=require('../cli/cli.logger');const session_basket_1=require('../zap-ts-models/session-basket');const rest_utils_1=require('../utils/rest-utils');const basket_service_1=require('../services/basket.service');const analytics_db_1=require('../../database/analytics-db');const api_routes_1=require('../settings/api-routes');class BidsApiController{constructor(){this.analyticsDb=new analytics_db_1.AnalyticsDb();console.log('BidsApiController --- XXX');this.basketService=new basket_service_1.BasketService();}apiGetBasket(req,resp){console.log('apiGetBasket ::',req.session.id);this.basketService.getCurrentBasket(req.session.id).then(data=>{resp.json(data);}).catch(err=>{cli_logger_1.Logger.logError('apiGetBasket :: err ::',err);});}apiAddBasketItem(req,resp){let data=req.body;let code=data.code;console.log('BIDS :: BODY ::',data);console.log('BIDS :: CODE ::',code);let res=this.doGetBids(code,req.session.id);rest_utils_1.RestUtils.jsonSuccess(resp,res);}apiDeleteBasketItem(req,resp){let code=req.body.code;this.basketService.removeItem(code).then(res=>{}).catch(err=>{});}apiReviewBasket(req,resp){let data=req.body;console.log('BASKET :: SESSION ID ::',req.session.id);}initRoutes(routes){routes.post(api_routes_1.ApiRoutes.Basket.GET_BASKET,this.apiGetBasket.bind(this));routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_ADD,this.apiAddBasketItem.bind(this));routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_DELETE,this.apiDeleteBasketItem.bind(this));routes.post(api_routes_1.ApiRoutes.Basket.POST_BASKET_REVIEW,this.apiReviewBasket.bind(this));}doGetBids(code,sessId){let result=true;try{cli_logger_1.Logger.log(`BasketChannelController :: doGetOffers`);}catch(err){cli_logger_1.Logger.logError('doGetBids :: ERROR ::',err);result=false;}return result;}getSessionBasket(sessId){let sessBasket=new session_basket_1.SessionBasket();return sessBasket;}}exports.BidsApiController=BidsApiController;