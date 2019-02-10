'use strict';Object.defineProperty(exports,'__esModule',{value:true});const cli_logger_1=require('./cli.logger');const fs=require('fs');class CliConfigFile{constructor(defaultPort=8080,fileEncoding='utf8'){this.defaultPort=defaultPort;this.fileEncoding=fileEncoding;}getConfig(configFilename='/app.config.json'){let result={port:this.defaultPort};let configFile=__dirname+configFilename;cli_logger_1.Logger.logPurple('Reading config file ::',configFile);try{if(fs.existsSync(configFile)){let contents=fs.readFileSync(configFile,this.fileEncoding);result=JSON.parse(contents);}}catch(ex){cli_logger_1.Logger.logError('Error parsing config file ::',ex);}return result;}}exports.CliConfigFile=CliConfigFile;