'use strict';Object.defineProperty(exports,'__esModule',{value:true});const db_kernel_1=require('../lib/dbcore/db-kernel');const app_settings_1=require('../app/app.settings');const log=console.log;class SessBasketTest{constructor(){console.log('SessBasketTest','constructor');this.db=new db_kernel_1.DBKernel(app_settings_1.Settings.Database.dbHost,app_settings_1.Settings.Database.dbUser,app_settings_1.Settings.Database.dbPass,app_settings_1.Settings.Database.dbName);}doRun(){let conn=this.db.createConnection();let sql='SELECT * FROM product_edition LIMIT 1';conn.query(sql,(error,result,tableFields)=>{if(error){console.log('ERROR ::',error);if(error.fatal){console.trace('fatal error: '+error.message);}}else{console.log('result',result);}});}}exports.SessBasketTest=SessBasketTest;function execute(){let app=new SessBasketTest();app.doRun();}execute();