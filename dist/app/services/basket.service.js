'use strict';var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var c=arguments.length,r=c<3?target:desc===null?desc=Object.getOwnPropertyDescriptor(target,key):desc,d;if(typeof Reflect==='object'&&typeof Reflect.decorate==='function')r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)if(d=decorators[i])r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r;return c>3&&r&&Object.defineProperty(target,key,r),r;};var __metadata=this&&this.__metadata||function(k,v){if(typeof Reflect==='object'&&typeof Reflect.metadata==='function')return Reflect.metadata(k,v);};var __param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex);};};Object.defineProperty(exports,'__esModule',{value:true});require('reflect-metadata');const inversify_1=require('inversify');const basket_item_model_1=require('../zap-ts-models/basket/basket-item.model');const vendor_basket_model_1=require('../zap-ts-models/basket/vendor-basket.model');const session_basket_1=require('../zap-ts-models/session-basket');const session_basket_2=require('../zap-ts-models/session-basket');const session_basket_3=require('../zap-ts-models/session-basket');const prand_num_1=require('../../lib/node-tsutils/prand-num');const product_db_1=require('../../database/product-db');const cli_logger_1=require('../cli/cli.logger');const basket_session_service_1=require('./basket-session.service');const barcode_parser_1=require('../../lib/utils/barcode-parser');const logging_service_1=require('./logging.service');let BasketService=class BasketService{constructor(loggingService){this.loggingService=loggingService;this.basketSessService=new basket_session_service_1.BasketSessionService();}saveBasketSession(sessId,session){return new Promise((resolve,reject)=>{this.basketSessService.saveSessionBasket(sessId,session).then(res=>{resolve(res);}).catch(err=>{reject(err);});});}getSessionBasket(sessId){this.loggingService.logBasket('getSessionBasket :: sessId',sessId);return new Promise((resolve,reject)=>{this.basketSessService.getSessionBasket(sessId).then(basket=>{this.loggingService.logBasket('getSessionBasket',basket);resolve(basket);}).catch(err=>{cli_logger_1.Logger.logError('getSessionBasket :: err ::',err);reject(err);});});}clearBasket(sessId){return new Promise((resolve,reject)=>{});}clearFlash(sessId){return new Promise((resolve,reject)=>{this.basketSessService.getSessionBasket(sessId).then(basket=>{basket.flash=new session_basket_2.SessionFlash();cli_logger_1.Logger.logPurple('BasketService :: getSessionBasket ::',sessId);return basket;}).then(basket=>{this.basketSessService.saveSessionBasket(sessId,basket).then(res=>{return basket;}).catch(ex=>{cli_logger_1.Logger.logError('clearFlash :: saveSessionBasket :: error ::',ex);return basket;});return basket;}).then(basket=>{resolve(basket);}).catch(err=>{cli_logger_1.Logger.logError('getSessionBasket :: err ::',err);reject(err);});});}ensureBasket(sessionBasket){if(!sessionBasket){sessionBasket=new session_basket_3.SessionBasket();console.log('ensureBasket :: Creating new SessionBasket');}return sessionBasket;}addToBasket(sessId,offerData){function prepStr(data){return data;}console.log('BasketService :: addToBasket :: offerData ::',offerData);return new Promise((resolve,reject)=>{this.getSessionBasket(sessId).then(sessionBasket=>{console.log('getSessionBasket :: offerData :: type ::',typeof offerData);console.log('getSessionBasket :: offerData :: offerData.accepted ::',offerData.accepted);let itemTitle=prepStr(offerData.title);sessionBasket.flash=new session_basket_2.SessionFlash();sessionBasket.flash.addItemName=itemTitle;if(!offerData.accepted){console.log('NOT ACCEPTED');sessionBasket.info.itemsRejected++;sessionBasket.flash.addItemSuccess=false;}else{sessionBasket.flash.addItemSuccess=true;if(!offerData.offer){offerData.offer='0';}let vendorOffer=parseFloat(offerData.offer);let resultItem=new basket_item_model_1.BasketItem(prand_num_1.PRandNum.randomNum(),1,offerData.code,offerData.vendorId,itemTitle,vendorOffer);resultItem.accepted=offerData.accepted;let result=this.addToVendorBasket(sessionBasket,resultItem);sessionBasket.info.itemsAccepted=this.getUniqueCount(sessionBasket);this.basketSessService.saveSessionBasket(sessId,sessionBasket).then(res=>{cli_logger_1.Logger.logPurple('saveSessionBasket :: sessId ::',sessId);}).catch(err=>{cli_logger_1.Logger.logError('saveSessionBasket :: err ::',err);});resolve(result);}}).catch(err=>{cli_logger_1.Logger.logError('addToBasket ::',err);reject();});});}getVendorBasket(sessBasket,vendorId){let result=null;console.log('Get getVendorBasket ##### sessBasket.data',sessBasket.vendorBaskets);if(!sessBasket.vendorBaskets){console.log('sessBasket.vendorBaskets :: was unassigned');sessBasket.vendorBaskets=new Array();}for(let i=0;i<sessBasket.vendorBaskets.length;i++){let basket=sessBasket.vendorBaskets[i];if(basket.vendorId===vendorId){result=basket;break;}}if(result===null){result=new vendor_basket_model_1.VendorBasketModel(vendorId);sessBasket.vendorBaskets.push(result);}return result;}addToAll(sessBasket,item){this.loggingService.logBasket('Add to all',item);if(!sessBasket.allItems){sessBasket.allItems=new Array();}let itemExists=false;for(let tmpItem of sessBasket.allItems){if(tmpItem.code===item.code){itemExists=true;break;}}if(itemExists){this.loggingService.logBasket('Add to all :: Item already exist',sessBasket.allItems);return;}this.loggingService.logBasket('Add to all',item);cli_logger_1.Logger.logPurple('Adding to all ::',item);sessBasket.allItems.push(new session_basket_1.ProdListItem(item.code,item.title));cli_logger_1.Logger.logPurple('Adding to all ::',item);}removeFromAll(sessBasket,code){cli_logger_1.Logger.logPurple('removeFromAll ::',code);cli_logger_1.Logger.logPurple('removeFromAll :: BEFORE ::',sessBasket.allItems);for(let i=0;i<sessBasket.allItems.length;i++){let item=sessBasket.allItems[i];if(item.code===code){sessBasket.allItems.splice(i,1);break;}}cli_logger_1.Logger.logPurple('removeFromAll :: AFTER ::',sessBasket.allItems);}addToVendorBasket(sessBasket,item){this.addToAll(sessBasket,item);let basket=this.getVendorBasket(sessBasket,item.vendorId);let existingItem=basket.items.find(o=>o.code===item.code);if(typeof existingItem==='object'){existingItem.count++;}else{basket.items.push(item);}return true;}getBasketTotal(basket){let total=0;if(basket.items===null)return 0;for(let index in basket.items){let item=basket.items[index];total=total+item.offer;}return total;}getCurrentBasket(sessId){console.log('getCurrentBasket -->');let scope=this;let result=null;let error=null;async function getBasket(){try{let sessionBasket=await scope.getReviewData(sessId);let baskets=sessionBasket.vendorBaskets;if(baskets&&baskets.length>0){let bestBasket=baskets[0];baskets=[bestBasket];}result=sessionBasket;}catch(ex){error=ex;}}return new Promise((resolve,reject)=>{getBasket().then(()=>{if(error!==null){reject(error);}else{resolve(result);}}).catch(err=>{cli_logger_1.Logger.logError('getCurrentBasket :: err ::',err);});});}getBestBasket(sessionBasket){let vendorBaskets=sessionBasket.vendorBaskets;let bestTotal=0;let bestBaset=null;console.log('getBestBasket ::',bestBaset);for(let index in vendorBaskets){let basket=vendorBaskets[index];let total=this.getBasketTotal(basket);if(total>bestTotal){bestTotal=total;bestBaset=basket;}}return bestBaset;}extendSessionBasket(sessionBasket){let prodDb=new product_db_1.ProductDb();return new Promise((resolve,reject)=>{prodDb.getProducts(['0819338020068','0887195000424']).then(res=>{}).catch(err=>{console.log('extendSessionBasket :: err ::',err);});});}getBasketCodes(sessionBasket){let result=new Array();if(!sessionBasket){return result;}function addBarcode(code){code=barcode_parser_1.BarcodeParser.prepEan13Code(code);if(result.indexOf(code)===-1){result.push(code);}}for(const vendorBasket of sessionBasket.vendorBaskets){for(const item of vendorBasket.items){addBarcode(item.code);}}return result;}getUniqueCount(sessionBasket){let list=this.getBasketCodes(sessionBasket);return list?list.length:0;}getFullBasket(sessId){return new Promise((resolve,reject)=>{return this.basketSessService.getSessionBasket(sessId).then(sessionBasket=>{resolve(sessionBasket);}).catch(err=>{cli_logger_1.Logger.logError('getFullBasket ::',err);reject(err);});});}sortSessionBasket(sessionBasket){this.ensureBasket(sessionBasket);for(const basket of sessionBasket.vendorBaskets){basket.totalValue=this.getBasketTotal(basket);}sessionBasket.vendorBaskets=sessionBasket.vendorBaskets.sort((x,y)=>{if(x.totalValue>y.totalValue){return-1;}if(x.totalValue<y.totalValue){return 1;}return 0;});return sessionBasket;}attachVendors(sessBasket,vendors){function getVendorDataById(vendorId){let result=null;for(let vendorData of vendors){if(vendorData.id===vendorId){result=vendorData;break;}}return result;}for(let vendorBasket of sessBasket.vendorBaskets){let vendorData=getVendorDataById(vendorBasket.vendorId);vendorBasket.vendorData=vendorData;}}calcBasketTotals(sessBasket){if(!sessBasket.vendorBaskets){cli_logger_1.Logger.logError('calcBasketTotals :: no vendorBaskets');return;}for(let vendorBasket of sessBasket.vendorBaskets){vendorBasket.totalValue=this.getBasketTotal(vendorBasket);}}getReviewData(sessId){let scope=this;let sessBasket;let prodDb=new product_db_1.ProductDb();function getProducts(){return new Promise((resolve,reject)=>{let codes=scope.getBasketCodes(sessBasket);return prodDb.getProducts(codes).then(res=>{resolve(res);}).catch(err=>{cli_logger_1.Logger.logError('getExtSessionBasket :: err ::',err);reject(err);});});}function getVendors(){return new Promise((resolve,reject)=>{return prodDb.getVendors().then(res=>{resolve(res);}).catch(err=>{cli_logger_1.Logger.logError('getExtSessionBasket :: err ::',err);});});}function getProdData(code,prodData){let res=null;for(let prod of prodData){if(prod.code===code){res=prod;break;}}return res;}function attachProductInfoToItem(sessBasket){scope.ensureBasket(sessBasket);for(let vb of sessBasket.vendorBaskets){for(let item of vb.items){let prodData=getProdData(item.code,sessBasket.productData);item.thumbImage=prodData.thumbImage;item.platformIcon=prodData.platformIcon;item.releaseDate=prodData.releaseDate;}}}async function getSessionBasket(){try{sessBasket=await scope.getFullBasket(sessId);if(!sessBasket.vendorBaskets){cli_logger_1.Logger.logDebug('Creating Vendor Array!');sessBasket.vendorBaskets=new Array();}let prodData=await getProducts();sessBasket.productData=prodData;let vendors=await getVendors();sessBasket=scope.sortSessionBasket(sessBasket);cli_logger_1.Logger.logDebug('SESSION BASKET \xA4\xA4\xA4\xA4\xA4\xA4 ::',sessBasket);attachProductInfoToItem(sessBasket);for(let vbasket of sessBasket.vendorBaskets){vbasket.highestBidder=false;}if(sessBasket.vendorBaskets.length>0){sessBasket.vendorBaskets[0].highestBidder=true;}scope.attachVendors(sessBasket,vendors);scope.calcBasketTotals(sessBasket);}catch(err){console.log('2 --- getExtSessionBasket :: getSessionBasket ::',err);}}return new Promise((resolve,reject)=>{getSessionBasket().then(()=>{resolve(sessBasket);}).catch(err=>{cli_logger_1.Logger.logFatalError('getExtSessionBasket');reject(err);});});}showBasket(sessId){this.getFullBasket(sessId).then(sessionBasket=>{for(const vendorData of sessionBasket.vendorBaskets){console.log('BASKET :: VENDOR ::',vendorData.vendorId);for(const item of vendorData.items){console.log('  ITEM ::',item);}}}).catch(err=>{cli_logger_1.Logger.logError('showBasket ::',err);});}removeProductData(code,basket){let result=false;return new Promise((resolve,reject)=>{try{basket.productData=!basket.productData?new Array():basket.productData;for(let i=0;i<basket.productData.length;i++){let product=basket.productData[i];if(product.code===code){console.log('>>> FOUND PROD TO REMOVE ::',code);basket.productData.splice(i,1);result=true;break;}}this.removeFromAll(basket,code);resolve(result);}catch(ex){reject(ex);}});}removeFromVendorBaskets(code,basket=null){let result=false;return new Promise((resolve,reject)=>{console.log('removeFromVendorBaskets :: removeProductData');try{for(const vendorData of basket.vendorBaskets){console.log('VENDOR BASKET ::',vendorData.vendorId);for(let i=0;i<vendorData.items.length;i++){let item=vendorData.items[i];if(item.code===code){console.log('>>> FOUND ITEM TO REMOVE ::',code);vendorData.items.splice(i,1);result=true;break;}}}resolve(result);}catch(ex){reject(ex);}});}removeItem(code,sessId){let scope=this;console.log('***************************');console.log('* REMOVE ITEM :: CODE ::',code);console.log('* REMOVE ITEM :: SESSID ::',sessId);console.log('***************************');return new Promise((resolve,reject)=>{this.getSessionBasket(sessId).then(sessionBasket=>{let remRes=this.removeFromVendorBaskets(code,sessionBasket);console.log('Rmmoved From Vendor Baskets ::',remRes);this.removeFromAll(sessionBasket,code);return sessionBasket;}).then(sessionBasket=>{let remRes=this.removeProductData(code,sessionBasket);console.log('Rmmoved From Product Data ::',remRes);return sessionBasket;}).then(sessionBasket=>{this.basketSessService.saveSessionBasket(sessId,sessionBasket);resolve(true);}).catch(err=>{cli_logger_1.Logger.logError('BasketService :: removeItem :: err ::',err);reject(err);});});}};BasketService=__decorate([inversify_1.injectable(),__param(0,inversify_1.inject('ILoggingService')),__metadata('design:paramtypes',[logging_service_1.LoggingService])],BasketService);exports.BasketService=BasketService;