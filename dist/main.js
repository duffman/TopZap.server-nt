'use strict';Object.defineProperty(exports,'__esModule',{value:true});const app_settings_1=require('./app/app.settings');const cli_logger_1=require('./app/cli/cli.logger');const cli_config_file_1=require('./app/cli/cli.config-file');const webapp_1=require('./app/webapp');const zapdrone_service_1=require('./app/pubsub/zapdrone.service');class Bootstrap{constructor(){let settings=new app_settings_1.AppSettings('127.0.0.1',8080);new webapp_1.WebApp(settings);new zapdrone_service_1.ZapdroneService();}createSettings(config){let listenHost=config.listenHost?config.listenHost:'127.0.0.1';let listenPort=config.listenPort?config.port:8080;return new app_settings_1.AppSettings(listenHost,listenPort);}run(){let config=new cli_config_file_1.CliConfigFile();try{let configData=config.getConfig();let settings=this.createSettings(configData);return true;}catch(err){cli_logger_1.Logger.logError('Run Failed ::',err);return false;}}}exports.Bootstrap=Bootstrap;let bootstrap=new Bootstrap();