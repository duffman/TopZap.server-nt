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

var path                          = require("path");
var fs                            = require("fs");
var vorpal                        = require("vorpal");
var chalk                         = vorpal().chalk;
var pkg                           = require("../../package.json");

//import { FileFinder }		from "../filesystem/file-finder";
//import { FileSystem }		from "../filesystem/filesystem";
import { ShellSession }		from "./shell-session";
import { ShellTerminal }	from "./shell-terminal";

class HydraShell {
	commander: any;
//	fileSystem: FileSystem;
	currentDirectory: string = "";
	terminal: ShellTerminal;
	session: ShellSession;

	constructor() {
//		this.fileSystem = new FileSystem();

		this.commander = vorpal().delimiter(chalk.magenta('hydra~$'));
		this.terminal = new ShellTerminal(this.commander);
		this.session = new ShellSession(this.commander);
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
	public displayFileListing(depth?: number) {
		this.terminal.echo(`File listing...`);


		var rootDirectory = "/Users/patrikforsberg/Development/";
		//var fileList = this.fileSystem.getFilesInDirectory(rootDirectory);


	}



	/*
	 public listFiles(directoryPath: string ) : any {
	 var dirContents = fs.readdirSync(directoryPath);
	 var directories = [];
	 var files = [];

	 for (var index in dirContents) {
	 var fullPath = path.join(directoryPath, dirContents[index]);

	 if (fs.lstatSync(fullPath).isFile()) {
	 files.push(dirContents[index]);
	 }
	 else if (fs.lstatSync(fullPath).isDirectory()) {
	 directories.push(dirContents[index]);
	 }
	 }

	 return files;
	 }
	 */
}

export { HydraShell };