/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * December 2018
 */

import * as net                   from 'net';
import { Server }                 from "net";
import { IgniterCli }             from '../igniter-cli';
import { ISrvListenResult }       from "../types/listener-result";
import { SrvListenResult }        from "../types/listener-result";
import { Log }                    from "../igniter-log";

export interface IPuppetServer {
	startListening(port: number): Promise<ISrvListenResult>;
}

export class PuppetServer implements IPuppetServer {
	name: string;
	server: Server;
	zingTimer: any;

	private sendZing(): void {

	}

	private resetZingTimer(): void {
	}

	constructor(name: string = "<NONAME>") {
		this.name = name;
		let scope = this;

		Log.info("Creating Server name ::", this.name);

		this.server = net.createServer((client) => {

			console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. clientSocket remote address : ' + client.remoteAddress + ':' + client.remotePort);

			client.setEncoding('utf-8');

			client.setTimeout(1000);

			//
			// Attach Event Handlers
			//
			scope.server.on("close", () => {
				console.log('TCP server socket is closed.');
			});

			scope.server.on("error", (error) => {
				console.error(JSON.stringify(error));
			});


			client.on('data', (newData) => {

				// Print received clientSocket data and length.
				console.log('Receive clientSocket send data : ' + newData + ', data size : ' + client.bytesRead);

				// Server send data back to clientSocket use clientSocket net.Socket object.
				client.write('Server received data : ' + newData + ', send back to clientSocket data size : ' + client.bytesWritten);
			});

			// When clientSocket send data complete.
			client.on('end', () => {
				console.log('Client disconnect.');

				client.end("bye bye");

				// Get current connections count.
				scope.server.getConnections((err, count) => {
					if (!err) {
						// Print current conn count in server console.
						console.log("There are %d connections now. ", count);
					} else  {
						console.error(JSON.stringify(err));
					}

				});
			});

			// When clientSocket timeout.
			client.on('timeout', function () {
				console.log('Client request time out. ');
			})
		});
	}

	public startListening(port: number): Promise<ISrvListenResult> {
		let scope = this;
		let result = new SrvListenResult();
		Log.info(`PuppetServer :: startListening`);

		return new Promise((resolve, reject) => {
			try {
				scope.server.listen(port, () => {
					result.addressInfo = scope.server.address();
					let serverInfoJson = JSON.stringify(result.addressInfo);

					Log.info("TCP server listen on address : " + serverInfoJson);
					result.success = true;
					resolve(result);

				});

			} catch (err) {
				Log.info("BALLE FJONG");
				resolve(result);
			}
		});
	}
}


//
// Command Line Start
//
let args = process.argv.slice(2);
console.log("args", args);

if (IgniterCli.startServer()) {
	console.log("Start Server");
	let portNum: number = -1;
	let hubName: string = args[2];

	try {
		portNum = Number.parseInt(args[1]);
	} catch(ex) {
		console.log("Invalid Service Listener Port");
		process.exit(345);
	}

	let srv = new PuppetServer(hubName);
	srv.startListening(portNum).then(res => {
		Log.data("Start Server Res ::", res);
	});

} else {
	Log.error("PuppetServer :: start :: error", new Error("Incorrect param count"))
}
