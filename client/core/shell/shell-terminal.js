/*
[ZYNAPTIC_CODE_FILE_HEADER STYLE="FULL" /]
[DESCRIPTION][/DESCRIPTION]
[CREATED YEAR="16" MONTH="4" DAY="21" /]
[ZYNAPTIC_CODE_FILE_HEADER:BEGIN]
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require("inquirer");
var chalk = require("chalk");
class ShellTerminal {
    constructor(commanderInstance) {
        this.commander = commanderInstance;
    }
    quit() {
        inquirer.prompt(["Quit BI Client Commander?"]).then(function (answers) {
            // Use user feedback for... whatever!!
        });
    }
    echoGreen(text) {
        var cmd = this.commander;
        cmd.log(chalk.green(text));
    }
    echo(text) {
        // chalk.white.bold("prefix"), 
        var cmd = this.commander;
        cmd.log(chalk.green(text));
    }
    echoLi(text) {
        var cmd = this.commander;
        cmd.log(chalk.yellow.bold("prefix"), chalk.green(text));
    }
}
exports.ShellTerminal = ShellTerminal;
