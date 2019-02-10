/*
[ZYNAPTIC_CODE_FILE_HEADER STYLE="FULL" /]
[DESCRIPTION][/DESCRIPTION]
[CREATED YEAR="16" MONTH="4" DAY="21" /]
[ZYNAPTIC_CODE_FILE_HEADER:BEGIN]
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var chalk = require("chalk");
// import { HydraNode } from "../filesystem/hydra-node";
class ShellSession {
    constructor(commanderInstance) {
        this.commander = commanderInstance;
        this.recentDirectories = new Array();
    }
}
exports.ShellSession = ShellSession;
