'use strict';Object.defineProperty(exports,'__esModule',{value:true});const request=require('request');class ZynPostData{constructor(){this.baseRequest=request.defaults({headers:{'content-type':'application/x-www-form-urlencoded','User-Agent':'TopZap'},'gzip':false,'json':true});let baseOptions={'headers':{'content-type':'application/x-www-form-urlencoded','User-Agent':'TopZap'},'gzip':false};}postData2(url,payload){return new Promise((resolve,reject)=>{this.baseRequest.post(url,payload,function optionalCallback(err,httpResponse,jsonData){if(err){reject(err);}else{resolve(jsonData);}});});}}exports.ZynPostData=ZynPostData;