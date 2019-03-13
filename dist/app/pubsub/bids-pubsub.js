'use strict';var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==='object'&&typeof Reflect.decorate==='function')r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r;};var __metadata=this&&this.__metadata||function(k,v){if(typeof Reflect==='object'&&typeof Reflect.metadata==='function')return Reflect.metadata(k,v);};Object.defineProperty(exports,'__esModule',{value:true});require('reflect-metadata');const inversify_1=require('inversify');const basket_service_1=require('../services/basket.service');const zap_message_types_1=require('../zap-ts-models/messages/zap-message-types');const pubsub_service_1=require('../../lib/topzap.pubsub-lib.git/pubsub-service');const pubsub_message_1=require('../../lib/topzap.pubsub-lib.git/pubsub-message');const publub_channels_1=require('../../lib/topzap.pubsub-lib.git/publub-channels');const cli_logger_1=require('../cli/cli.logger');let BidsPubsub=class BidsPubsub{constructor(){this.pubsubService=new pubsub_service_1.PubsubService();this.pubsubService.subscribe([publub_channels_1.Channels.NewBidChannel]);this.basketService=new basket_service_1.BasketService();this.pubsubService.onNewBidMessage(msg=>{this.onNewVendorBid(msg);});}getBid(code,sessionId){let message=new pubsub_message_1.PubsubMessage(zap_message_types_1.ZapMessageType.GetOffers,{code:code},sessionId);return this.pubsubService.emitGetBidRequest(code,sessionId);}onNewVendorBid(message){let vendorBid=message.data;console.log('onNewVendorBid ::',message);console.log('onNewVendorBid :: data ::',message.data);this.basketService.addToBasket(message.sessId,vendorBid.data).then(res=>{this.pubsubService.emitGetBestBasketMessage(message.sessId).then(res=>{cli_logger_1.Logger.logYellow('\xA4\xA4\xA4\xA4\xA4\xA4 emitGetBestBasketMessage :: sessId ::',message.sessId);}).catch(err=>{cli_logger_1.Logger.logError('\xA4\xA4\xA4\xA4\xA4\xA4 emitGetBestBasketMessage :: err ::',err);});}).catch(err=>{console.log('onNewVendorBid :: error ::',err);});}};BidsPubsub=__decorate([inversify_1.injectable(),__metadata('design:paramtypes',[])],BidsPubsub);exports.BidsPubsub=BidsPubsub;