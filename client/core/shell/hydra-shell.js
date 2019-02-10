/**
 * Created by patrikforsberg on 23/05/17.
 */
// #!/usr/bin/env node
/*
 [ZYNAPTIC_CODE_FILE_HEADER STYLE="FULL" /]
 [DESCRIPTION][/DESCRIPTION]
 [CREATED YEAR="16" MONTH="4" DAY="21" /]
 [ZYNAPTIC_CODE_FILE_HEADER:BEGIN]
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var vorpal = require("vorpal");
var chalk = vorpal().chalk;
var pkg = require("../../package.json");
//import { FileFinder }		from "../filesystem/file-finder";
//import { FileSystem }		from "../filesystem/filesystem";
const shell_session_1 = require("./shell-session");
const shell_terminal_1 = require("./shell-terminal");
class HydraShell {
    constructor() {
        //		this.fileSystem = new FileSystem();
        //	fileSystem: FileSystem;
        this.currentDirectory = "";
        this.commander = vorpal().delimiter(chalk.magenta('hydra~$'));
        this.terminal = new shell_terminal_1.ShellTerminal(this.commander);
        this.session = new shell_session_1.ShellSession(this.commander);
        this.initCommander();
        this.commander.show().parse(process.argv);
    }
    /**
     *	Reguster commands
     */
    initCommander() {
        var self = this;
        this.terminal.echo(`Hydra Commander v${pkg.version}`);
        this.commander.command("ls")
            .option('-b, --backwards')
            .option('-t, --twice')
            .action(function (args, callback) {
            self.displayFileListing();
            callback();
        });
        this.commander.command('connect');
    }
    /**
     *	@depth specified how many levels that is allowed when listing nodes
     *	if a directoryTree
     */
    displayFileListing(depth) {
        this.terminal.echo(`File listing...`);
        var rootDirectory = "/Users/patrikforsberg/Development/";
        //var fileList = this.fileSystem.getFilesInDirectory(rootDirectory);
    }
}
exports.HydraShell = HydraShell;
