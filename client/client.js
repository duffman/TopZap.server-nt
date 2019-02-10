"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageTypes_1 = require("../../TopZap.Backend/Messaging/MessageTypes");
let io = require('socket.io-client');
let url = 'http://localhost:9090';
let socket = io.connect(url, { reconnect: true });
let vorpal = require('vorpal')();
let chalk = require("chalk");
class CommandHandler {
    constructor() { }
    addHandler(vorpal) {
    }
}
exports.CommandHandler = CommandHandler;
class IgniterCLIClient {
    constructor() {
        this.commands = Array();
        this.testPlayerId = 563;
        this.initialize();
        //this.commands.push(new ChestEvents());
    }
    initialize() {
        socket.on('disconnect', function (socket) {
            console.log(chalk.red('Disconnected'));
        });
        socket.on('connect', function (socket) {
            console.log(chalk.green('Connected'));
        });
        socket.on('message', function (data) {
            console.log("Message received", data);
        });
        vorpal.delimiter('viola$').show();
        this.initVorpal();
    }
    generateTag() {
        return "biCoreClient";
    }
    sendMessage(type, data, tag = "") {
        let dataObject = {
            "type": type,
            "data": data,
            "tag": tag,
        };
        let jsonData = JSON.stringify(dataObject);
        console.log(chalk.green("OUT >>"));
        console.log(chalk.green(jsonData));
        console.log(" ");
        socket.emit("message", jsonData);
    }
    /******************
     * SEND METHODS
     */
    buildPackage(type, data) {
    }
    sendAction(type, data = null) {
        this.sendMessage(type, data);
    }
    initGame(uuid) {
        var dataPacket = {
            "device": "iPhone6s",
            "uuid": uuid
        };
        this.sendMessage(MessageTypes_1.MessageTypes.Session.Initialize, dataPacket, "#GENERATED_TAG#");
    }
    initVorpal() {
        var scope = this;
        for (let command in this.commands) {
        }
        vorpal.command('mess [str]').action(function (args, callback) {
            let arg = args.str != null ? args.str : "";
            let dataPacket = {
                "rId": arg,
                "type": "text",
                "data": args
            };
            scope.sendAction(MessageTypes_1.MessageTypes.User.SendMessage, dataPacket);
            callback();
        });
        vorpal.command("init [str]").action(function (args, callback) {
            console.log('Arg:', args.str);
            let uuid = args.str != null ? args.str : "MrDuffman81";
            console.log("Using UUID:", args.str);
            scope.initGame(uuid);
            callback();
        });
        vorpal.command("session [str]").action(function (args, callback) {
            console.log('Arg:', args.str);
            scope.sendMessage(MessageTypes_1.MessageTypes.Session.Initialize, null);
            callback();
        });
    }
}
exports.IgniterCLIClient = IgniterCLIClient;
let client = new IgniterCLIClient();
