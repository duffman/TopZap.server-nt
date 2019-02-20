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
    })(DebugReportingLevel = Global.DebugReportingLevel || (Global.DebugReportingLevel = {}));
    let Debug;
    (function (Debug) {
        Debug.DebugLevel = DebugReportingLevel.Low;
        function Verbose() {
            return this.DebugLevel == DebugReportingLevel.High;
        }
        Debug.Verbose = Verbose;
    })(Debug = Global.Debug || (Global.Debug = {}));
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
