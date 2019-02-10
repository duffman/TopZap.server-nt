'use strict';Object.defineProperty(exports,'__esModule',{value:true});const net_1=require('net');const igniter_cli_1=require('../igniter-cli');const igniter_log_1=require('../igniter-log');const igniter_settings_1=require('../igniter.settings');const puppet_settings_1=require('./puppet.settings');class PuppetClient{constructor(name='<NONAME>'){this.doReconnect=true;this.reConnecting=false;this.reConnectAttempts=0;this.reConnectTimer=null;this.attenpts=0;let scope=this;this.name=name;this.clientSocket=new net_1.Socket();let client=this.clientSocket;client.setEncoding(puppet_settings_1.PuppetSettings.ClientDataEncoding);client.on('connect',()=>{console.log('CONNECT >>>>>>>>>>>>>>>>');let localAddress=client.localAddress;let localPort=client.localPort;let remoteAddress=client.remoteAddress;let remotePort=client.remotePort;console.log('Connection local address : '+localAddress+':'+localPort);console.log('Connection remote address : '+remoteAddress+':'+remotePort);if(this.reConnectTimer!==null){clearInterval(this.reConnectTimer);}});client.on('connection',()=>{console.log('CONNECTION >>>>>>>>>>>>>>>>');});client.on('data',function(data){console.log('IOServer return data : '+data);});client.on('end',()=>{this.onDisconnect();console.log('Client socket disconnect ::','END');});client.on('timeout',function(){this.socketDisconnect();console.log('Client conn timeout. ');});client.on('error',err=>{if(err.code=='ECONNREFUSED'){scope.onDisconnect();console.log('Timeout for 5 seconds before trying again...');}else{console.error(JSON.stringify(err));}});}onDisconnect(reConnect=true){let scope=this;this.reConnecting=true;this.attenpts=0;function connectAgain(){if(!scope.clientOptions){igniter_log_1.Log.error('connectAgain() :: Client Options Missing');return;}scope.attenpts++;console.log('Connect Again attempts ::',scope.attenpts);scope.connect(scope.clientOptions);}this.reConnectTimer=setInterval(function(){connectAgain();},3000);}connectAgain(){this.attenpts++;console.log('Connect Again attempts ::',this.attenpts);if(!this.clientOptions){igniter_log_1.Log.error('connectAgain() :: Client Options Missing');return;}this.connect(this.clientOptions);}connect(clientOptions){let scope=this;this.clientOptions=clientOptions;let client=this.clientSocket;if(client.connecting){console.log('Already In Connect');return;}client.connect(clientOptions.port,clientOptions.host);}sendString(dataString){this.clientSocket.write(dataString);}sendMessage(message){const messageDataStr=JSON.stringify(message);this.clientSocket.write(messageDataStr);}}exports.PuppetClient=PuppetClient;let args=process.argv.slice(2);console.log('args',args);if(igniter_cli_1.IgniterCli.startClient()){console.log('Start IOServer');let portNum=-1;let name=args[2];try{portNum=Number.parseInt(args[1]);}catch(ex){console.log('Invalid Service Listener Port');process.exit(345);}let client=new PuppetClient(name);igniter_log_1.Log.data('Client Connecting on port ::\'',portNum);let clientOptions={host:puppet_settings_1.PuppetSettings.Local,port:portNum,retryAlways:true,reConnectInterval:igniter_settings_1.IgniterSettings.ReConnectInterval};client.connect(clientOptions);}else{igniter_log_1.Log.error('PuppetClient :: start :: error',new Error('Incorrect param count'));}