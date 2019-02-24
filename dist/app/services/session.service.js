'use strict';Object.defineProperty(exports,'__esModule',{value:true});const db_kernel_1=require('../../lib/dbcore/db-kernel');const cli_logger_1=require('../cli/cli.logger');class SessionService{constructor(expireMinutes=10080){this.expireMinutes=expireMinutes;this.db=new db_kernel_1.DBKernel();}escapeJSON(data){if(data){data=data.replace(new RegExp('\\\''.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,'\\$1'),'g'),'\'');data=data.replace(/"((?:"[^"]*"|[^"])*?)"(?=[:},])(?=(?:"[^"]*"|[^"])*$)/gm,(match,group)=>{return'"'+group.replace(/"/g,'\\"')+'"';});}return data;}isExpired(expires){cli_logger_1.Logger.logDebug('debug','Socket.io-mysql-session: _isExpired');let now=Math.round(new Date(Date.now()).getTime()/1000);return now>expires;}createTable(){let sql=`CREATE TABLE session(
					sessionId varchar(32) COLLATE utf8_bin NOT NULL," 
					expires int(11) unsigned NOT NULL,"
					data text COLLATE utf8_bin, PRIMARY KEY (sessionId)
				) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`;}saveSession(sessId,data,expiresMinutes=-1){let sessionData=JSON.stringify(data);if(expiresMinutes>-1){expiresMinutes=this.expireMinutes;}let query=`REPLACE INTO session (sessionId, expires, data)
						VALUES (
						'${sessId}',
						UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL ${expiresMinutes} MINUTE)),
						'${sessionData}')`;return new Promise((resolve,reject)=>{return this.db.dbQuery(query).then(res=>{resolve(res.success);}).catch(err=>{console.log('dbQuery ERR ::',err);reject(err);});});}getSession(sessId){let result=null;let query=`SELECT * FROM session WHERE sessionId ="${sessId}"`;return new Promise((resolve,reject)=>{this.db.dbQuery(query).then(res=>{let row=res.safeGetFirstRow();let data=row.getValAsStr('data');console.log('DATA BEFORE PARSE::',data);data=this.escapeJSON(data);let sessionData=data?JSON.parse(data):{};resolve(sessionData);}).catch(err=>{cli_logger_1.Logger.logError('getSession ::',err);reject(err);});});}}exports.SessionService=SessionService;