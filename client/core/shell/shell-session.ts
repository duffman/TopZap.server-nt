/*
[ZYNAPTIC_CODE_FILE_HEADER STYLE="FULL" /]
[DESCRIPTION][/DESCRIPTION]
[CREATED YEAR="16" MONTH="4" DAY="21" /]
[ZYNAPTIC_CODE_FILE_HEADER:BEGIN]
*/

"use strict";

var fs = require("fs");
var chalk = require("chalk");

// import { HydraNode } from "../filesystem/hydra-node";

class ShellSession {
	commander: any;
	// currentDirectory: HydraNode;
	recentDirectories: string[];

	constructor(commanderInstance: any) {
		this.commander = commanderInstance;
		this.recentDirectories = new Array<string>();
	}
}

export { ShellSession }
