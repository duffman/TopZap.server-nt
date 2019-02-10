//import { MessageTypes } from "../../TopZap.Backend/Messaging/MessageTypes";

import { ZapMessageType } from '../app/zap-ts-models/messages/zap-message-types';
import {MessageType} from '../lib/coldmind-igniter/messaging/message-types';
import {MessageFactory} from '../lib/coldmind-igniter/messaging/message-factory';


let io = require('socket.io-client');

let url = 'http://localhost:9090';

let socket = io.connect(url, {reconnect: true});
let vorpal = require('vorpal')();

let chalk = require("chalk");

export interface IClientCommand { }

export class CommandHandler {
	constructor() {}

	public addHandler(vorpal: any) {
	}
}

export class IgniterCLIClient {
	commands = Array<IClientCommand>();

	constructor() {
		this.initialize();
		//this.commands.push(new ChestEvents());
	}

	private testPlayerId: number = 563;

	initialize() {
		socket.on('disconnect', function (socket) {
			console.log(chalk.red('Disconnected'));
		});

		socket.on('connect', function (socket) {
			console.log(chalk.green('Connected'));
		});

		socket.on('message', function(data) {
			console.log("Message received", data);
		});

		vorpal.delimiter('viola$').show();

		this.initVorpal();
	}

	private generateTag() {
		return "biCoreClient"
	}
	private sendMessage(type: string, data: any, tag: string = "") {
		/*let dataObject = {
			"type" : type,
			"data": data,
			"tag" : tag,
		};

		let jsonData = JSON.stringify(dataObject);
		*/

		data = data === null ? {} : data;
		let mess = MessageFactory.newIgniterMessage(MessageType.Error, "id", data, tag);
		//return this.sendToSessionId(sessId, mess);

		console.log(chalk.green("OUT >>"));
		console.log(chalk.green(JSON.stringify(mess)));
		console.log(" ");

		socket.emit("message", mess);
	}

	/******************
	 * SEND METHODS
	 */
	private buildPackage(type: string, data: any) {
	}

	private sendAction(type: string, data: any = null) {
		this.sendMessage(type, data);
	}

	private initGame(uuid: string) {
		var dataPacket = {
			"device":"iPhone6s",
			"uuid": uuid
		};

		//this.sendMessage(MessageTypes.Session.Initialize, dataPacket, "#GENERATED_TAG#");
	}

	initVorpal() {
		var scope = this;

		for (let command in this.commands) {
		}

		vorpal.command('mess [str]').action(function(args, callback) {
			let arg = args.str != null ? args.str : "";

			let dataPacket = {
				"rId": arg,
				"type": "text",
				"data": args
			};

		//	scope.sendAction(dataPacket);

			callback();
		});

		vorpal.command("init [str]").action(function(args, callback) {
			console.log('Arg:', args.str);
			let uuid = args.str != null ? args.str: "MrDuffman81";
			console.log("Using UUID:", args.str);

			scope.initGame(uuid);
			callback();
		});


		vorpal.command("session [str]").action(function(args, callback) {
			console.log('Arg:', args.str);

			scope.sendMessage(MessageType.Action, null);

			callback();
		});
	}
}

let client = new IgniterCLIClient();