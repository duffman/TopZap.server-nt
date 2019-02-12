/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * December 2018
 */

import { Socket }                 from "net";
import { IgniterCli }             from '../igniter-cli';
import { Log }                    from "../igniter-log";
import { IgniterSettings }        from "../igniter.settings";
import { PuppetSettings }         from "./puppet.settings";
import { ZynMessage }         from '@igniter/messaging/igniter-messages';

export interface IPuppetNode {
}

export interface IPuppetClient extends IPuppetNode {
	connect(clientOptions: IClientOptions);
	sendString(dataString: string): void;
	sendMessage(message: ZynMessage): void;
}

export interface IClientOptions {
	host: string;
	port: number;
	retryAlways: boolean;
	reConnectInterval: number;
}

export class PuppetClient implements IPuppetClient {
	name: string;
	clientOptions: IClientOptions;
	clientSocket: Socket;
	//
	// ReConnect Related
	//
	doReconnect: boolean = true;
	reConnecting: boolean = false;
	reConnectAttempts: number = 0;
	reConnectTimer: any = null;

	attenpts = 0;
	constructor(name: string = "<NONAME>") {
		let scope = this;
		this.name = name;
		this.clientSocket = new Socket();
		let client = this.clientSocket;

		client.setEncoding(PuppetSettings.ClientDataEncoding);

		client.on('connect', () => {
			console.log("CONNECT >>>>>>>>>>>>>>>>");

			let localAddress = client.localAddress;
			let localPort = client.localPort;
			let remoteAddress = client.remoteAddress;
			let remotePort = client.remotePort;

			console.log('Connection local address : ' + localAddress + ":" + localPort);
			console.log('Connection remote address : ' + remoteAddress + ":" + remotePort);

			if (this.reConnectTimer !== null) {
				clearInterval(this.reConnectTimer);
			}
		});

		client.on('connection', () => {
			console.log("CONNECTION >>>>>>>>>>>>>>>>");
		});

		// When receive server send back vendorBaskets.
		client.on('data', function (data) {
			console.log('IOServer return vendorBaskets : ' + data);
		});

		// When conn disconnected.
		client.on('end', () => {
			this.onDisconnect();
			console.log('Client socket disconnect ::', "END");
		});

		client.on('timeout', function () {
			this.socketDisconnect();
			console.log('Client conn timeout. ');
		});

		client.on('error', (err: any) => {
			// this.socketDisconnect(); ?? TODO: investigate is another disconnect events triggered aswell if this ends the conn??

			if(err.code == 'ECONNREFUSED') {

				//coldmind.setTimeout(4000, function() {
				//	scope.connectAgain();
				//});

				scope.onDisconnect();

				console.log('Timeout for 5 seconds before trying again...');

			} else {
				console.error(JSON.stringify(err));
			}
		});
	}

	private onDisconnect(reConnect: boolean = true) {
		let scope = this;
		this.reConnecting = true;

		this.attenpts = 0;

		function connectAgain() {
			if (!scope.clientOptions) {
				Log.error("connectAgain() :: Client Options Missing");
				return;
			}

			scope.attenpts++;

			console.log("Connect Again attempts ::", scope.attenpts);

			scope.connect(scope.clientOptions);
		}

		this.reConnectTimer = setInterval(
			function () {
				connectAgain();
			}
			, 3000);

	}

	public connectAgain() {
		this.attenpts++;

		console.log("Connect Again attempts ::", this.attenpts);

		if (!this.clientOptions) {
			Log.error("connectAgain() :: Client Options Missing");
			return;
		}

		this.connect(this.clientOptions);
	}

	public connect(clientOptions: IClientOptions) {
		let scope = this;
		this.clientOptions = clientOptions;
		let client = this.clientSocket;

		if (client.connecting) {
			console.log("Already In Connect");
			return;
		}

		client.connect(clientOptions.port, clientOptions.host); /*, () => {
			let localAddress = coldmind.localAddress;
			let localPort = coldmind.localPort;
			let remoteAddress = coldmind.remoteAddress;
			let remotePort = coldmind.remotePort;

			console.log('Connection local address : ' + localAddress + ":" + localPort);
			console.log('Connection remote address : ' + remoteAddress + ":" + remotePort);
		});*/


	}

	public sendString(dataString: string): void {
		this.clientSocket.write(dataString);
	}

	public sendMessage(message: ZynMessage): void {
		const messageDataStr = JSON.stringify(message);
		this.clientSocket.write(messageDataStr);
	}
}

//
// Command Line Start
//
let args = process.argv.slice(2);
console.log("args", args);

if (IgniterCli.startClient()) {
	console.log("Start IOServer");
	let portNum: number = -1;
	let name: string = args[2];

	try {
		portNum = Number.parseInt(args[1]);
	} catch(ex) {
		console.log("Invalid Service Listener Port");
		process.exit(345);
	}

	let client = new PuppetClient(name);

	Log.data("Client Connecting on port ::'", portNum);

	let clientOptions: IClientOptions = {
		host: PuppetSettings.Local,
		port: portNum,
		retryAlways: true,
		reConnectInterval: IgniterSettings.ReConnectInterval
	};

	client.connect(clientOptions);

} else {
	Log.error("PuppetClient :: start :: error", new Error("Incorrect param count"))
}

/*
const testText = "För kompisarna Bruno Brynfläsk & Petter Pruttstjärt hade det gått vilt "
	+ "till och dom hade slösat alla sina pengar på korsords-tidningar och blev således tvingade "
	+ "att prostituera sig själva på i ett parkeringshus för att få råd till att köpa nya kyskhetsbälten, "
	+ "detta var en mycket olycklig situation, låt se om deras berättelse överförs korrekt över "
	+ "UDP-kopplingen i ett stycke, låt oss också hoppas att ingen använder denna text i en "
	+ "översättnings-tjänst med rätt till och från-språk!";

*/