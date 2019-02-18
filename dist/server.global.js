"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Global;
(function (Global) {
    let DebugReportingLevel;
    (function (DebugReportingLevel) {
        DebugReportingLevel[DebugReportingLevel["None"] = 0] = "None";
        DebugReportingLevel[DebugReportingLevel["Low"] = 1] = "Low";
        DebugReportingLevel[DebugReportingLevel["Medium"] = 2] = "Medium";
        DebugReportingLevel[DebugReportingLevel["High"] = 3] = "High";
        DebugReportingLevel[DebugReportingLevel["CharlieCheen"] = 4] = "CharlieCheen";
    })(DebugReportingLevel = Global.DebugReportingLevel || (Global.DebugReportingLevel = {}));
    /**
     *	The current state of the application
     */
    let AppState;
    (function (AppState) {
        AppState[AppState["Idle"] = 0] = "Idle";
        AppState[AppState["Loading"] = 1] = "Loading";
        AppState[AppState["Ready"] = 2] = "Ready";
        AppState[AppState["Error"] = 3] = "Error";
    })(AppState = Global.AppState || (Global.AppState = {}));
    /**
     * Core ColdmindServerCore Settings
     */
    let Debug;
    (function (Debug) {
        Debug.DebugLevel = DebugReportingLevel.Low;
        function Verbose() {
            return this.DebugLevel == DebugReportingLevel.High;
        }
        Debug.Verbose = Verbose;
    })(Debug = Global.Debug || (Global.Debug = {}));
    let Core;
    (function (Core) {
        Core.SERVER_VERSION = 'Backend Igniter 1.3.5-DEV';
        Core.CUSTOMER_BRANCH = 'VIOLA - Clear Vision 0.9.2 - Eldring AB';
    })(Core = Global.Core || (Global.Core = {}));
    let Networking;
    (function (Networking) {
        //export const webServerPort             = 80;
        //export const socketIOPort              = process.env.PORT || 5000;
        Networking.socketIOPort = 9090;
        Networking.webSocketPort = 6060;
    })(Networking = Global.Networking || (Global.Networking = {}));
    /**
     *	Public Application Settings
     */
    let Settings;
    (function (Settings) {
        Settings.publicWebDirectory = "core";
        Settings.appDirectory = "app";
        Settings.defaultConfigFilename = "viola.config.json";
        Settings.debug = true;
        Settings.terminateOnError = false;
        let SQLDatabase_Test;
        (function (SQLDatabase_Test) {
            SQLDatabase_Test.dbName = "clear_vision2";
            SQLDatabase_Test.dbHost = "localhost";
            SQLDatabase_Test.dbUser = "duffman";
            SQLDatabase_Test.dbPass = "bjoe7151212";
        })(SQLDatabase_Test = Settings.SQLDatabase_Test || (Settings.SQLDatabase_Test = {}));
        let SQLDatabase;
        (function (SQLDatabase) {
            SQLDatabase.dbName = "clear_vision";
            SQLDatabase.dbHost = "localhost";
            SQLDatabase.dbPort = 3306;
            SQLDatabase.dbUser = "duffman";
            SQLDatabase.dbPass = "bjoe7151212";
            SQLDatabase.useTransactions = false;
        })(SQLDatabase = Settings.SQLDatabase || (Settings.SQLDatabase = {}));
    })(Settings = Global.Settings || (Global.Settings = {}));
    /**
     * Socket Event Labels
     */
    let SocketEvents;
    (function (SocketEvents) {
        SocketEvents.newConnection = "newConnection";
        SocketEvents.closed = "closed";
        SocketEvents.dataAvailable = "dataAvailable";
        SocketEvents.reconnect = "reconnect";
        SocketEvents.error = "error";
    })(SocketEvents = Global.SocketEvents || (Global.SocketEvents = {}));
    let ServerMode;
    (function (ServerMode) {
        ServerMode[ServerMode["Debug"] = 0] = "Debug";
        ServerMode[ServerMode["Test"] = 1] = "Test";
        ServerMode[ServerMode["Production"] = 2] = "Production";
    })(ServerMode = Global.ServerMode || (Global.ServerMode = {}));
    Global.Mode = ServerMode.Debug;
    Global.DebugMode = (Global.Mode == ServerMode.Debug);
})(Global || (Global = {}));
exports.Global = Global;
