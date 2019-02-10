/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

let chalk = require("chalk");
const log = console.log;
import { CliGlobal } from "./cli.global";

export enum GLogDebugLevel {
	Normal,
	Intense
}

export class Logger {
	private static error = chalk.bold.red;
	private static warning = chalk.bold.yellow;

	public static spit() {
		console.log(" ");
	}

	public static log(logMessage: string, logData: any = null) {
		if (logData != null) {
			log(chalk.green(logMessage), logData);
		} else {
			log(chalk.yellow(logMessage));
		}
	}

	private static makeLine(count: number, char: string = "-"): string {
		let line = "";
		for (let i = 0; i < count; i++) {
			line += char;
		}
		return line;
	}

	public static logObject(obj: any, title: string = null) {
		if (title != null) {
			Logger.logYellow("-- Obj: " + title);
			Logger.logYellow(Logger.makeLine(title.length + 10));
		}

		for (let key in obj) {
			if (obj.hasOwnProperty(key) ) {
				Logger.logYellow(key, obj[key]);
			}
		}
	}


	/**
	 * Standard Debug Log
	 *
	 * @param caller - object, used to getAs class name
	 * @param logMessage - The message to print
	 * @param logData - Optional configureWebServer such as configureWebServer structures
	 */
	public static logDebugCaller(caller: any, logMessage: string, logData: any = "") {
		if (CliGlobal.DebugMode) {
			log(chalk.cyan("#DEBUG :: " + caller.constructor.name + " :: " + logMessage), logData);
		}
	}

	public static logDebug(logMessage: string, logData: any = "") {
		if (CliGlobal.DebugMode) {
			log(chalk.cyan("#DEBUG :: " + logMessage), logData);
		}
	}

	public static logDebugErr(logMessage: string, data: any = null) {
		if (!CliGlobal.DebugMode) return;
		data = data !== null ? JSON.stringify(data) : null;

		if (data === null) {
			log(chalk.red("#ERR :: " + logMessage));
		} else {
			log(chalk.red("#ERR :: " + logMessage + " :: " + data));
		}
	}

	public static logStd(caller: any, logMessage: string, logData: any = "") {
		if (CliGlobal.DebugMode) {
			log(chalk.cyan("#DEBUG :: " + logMessage), logData);
		}
	}

	public static logAppError(caller: any, logMessage: string, logData: any = "") {
		if (CliGlobal.DebugMode) {
			log(chalk.red("#ERROR :: " + caller.constructor.name + " :: " + logMessage), logData);
		}
	}

	public static logCoreInfo(caller: any, logMessage: string, logData: any = "") {
		if (CliGlobal.DebugMode) {
			log(chalk.cyan("#DEBUG :: " + caller.constructor.name + " :: " + logMessage), logData);
		}
	}

	public static logSuccessMessage(message: string, success: boolean) {
		if (success) {
			log(chalk.bold.black.bgGreen("# SUCCESS ") + chalk.black.bgGreen(message));
		} else {
			log(chalk.bold.white.bgRed("# FAILED ") + chalk.white.bgBlack(message));
		}
	}


	public static logExtDebug(level: GLogDebugLevel, logMessage: string) {
		log(chalk.green(logMessage));
	}

	public static logWarning(warningMessage: string, logData: any = null) {
		logData = logData == null ? "" : logData;
		log(this.warning(warningMessage), logData);
	}

	public static scream(logMessage: string, logData: any = null) {
		logData = logData == null ? "" : logData;
		log(chalk.black.underline.bgYellow(logMessage), logData);
	}

	public static logFatalErrorMess(errorMessage: string, logData: any = "") {
		let data = logData != null ? " ::: " + JSON.stringify(logData) : "";
		log(chalk.white.underline.bgRed(errorMessage + logData));
	}

	public static logFatalError(errorMessage: string, error: Error = null) {
		if (error == null) {
			log(chalk.white.underline.bgRed(errorMessage));
		}
		else {
			log(chalk.white.underline.bgRed(errorMessage), error);
		}
	}

	public static logErrorMessage(errorMessage: string, error: Error = null) {
		if (error == null)
			log(this.error(errorMessage))
		else
			log(this.error(errorMessage), error);
	}

	public static logErrorWithStrongWord(begin: string, strongWord: string, end: string) {
		log(chalk.bold.red(begin) + " " + chalk.bold.white.bgRed(strongWord) + " " + chalk.bold.red(begin));
	}

	public static logOut(logMessage: string, logData: any = null) {
		logData = logData == null ? "" : logData;
		log(this.error(logMessage), logData);
	}

	public static logError(logMessage: string, logData: any = null) {
		logData = logData == null ? "" : logData;
		log(this.error(logMessage), logData);
	}

	/**
	 *
	 * @param {string} logMessage
	 * @param logData
	 */
	public static globalDebug(success: boolean, logData: any = null, ... logMessages: Array<string>) {
		if (!CliGlobal.Debug.DebugLog) return;
		let message = logMessages.join(":::");
		if (success) {
			Logger.logGreen(message, logData);
		} else {
			Logger.logRed(message, logData);
		}
	}

	/*****************
	 */

	public static prepStr(logMessage: string, logData: any = null) : string {
		//console.log("prepStr", "'" + logMessage + "'");

		logData = logData == null ? "" : JSON.stringify(logData);
		return logMessage + " #> " + logData;
	}


	/***********/
	public static logGreenPrefix(prefix: string, logMessage: string, logData: any = null) {
		let logStr = Logger.prepStr(logMessage, logData);
		log(chalk.bold.black.bgGreen("#" + prefix + ":") + chalk.greenBright(logStr));
	}

	public static logRedPrefix(prefix: string, logMessage: string, logData: any = null) {
		let logStr = Logger.prepStr(logMessage, logData);
		log(chalk.bold.white.bgRed("#" + prefix + ":") + chalk.redBright(logStr));
	}
	/***********/


	public static logGreen(logMessage: string, logData: any = null) {
		//let logStr = Logger.prepStr(logMessage, logData);
		//log(chalk.greenBright(logStr));

		if (logData) {
			log(chalk.greenBright(logMessage), chalk.greenBright(logData));
		} else {
			log(chalk.greenBright(logMessage));
		}
	}

	public static logRed(logMessage: string, logData: any = null) {
		//console.log("logRed", "'" + logMessage + "'");

		//let logStr = Logger.prepStr(logMessage, logData);
		//log(chalk.redBright(logStr));

		log(chalk.redBright(logMessage), chalk.redBright(logData));

	}

	public static logYellow(logMessage: string, logData: any = "") {
		log(chalk.yellow(logMessage), logData);
	}

	public static logCyan(logMessage: string, logData: any = "") {
		log(chalk.cyan(logMessage), logData);
	}

	public static logBlue(logMessage: string, logData: any = "") {
		log(chalk.blue(logMessage), logData);
	}

	public static logPurple(logMessage: string, logData: any = null) {
		if (logData == null)
			log(chalk.magenta(logMessage));
		else
			log(chalk.magenta(logMessage), logData);
	}

	public static logImportant(prefix: string, logMessage: string) {
		log(chalk.bold.white.bgBlue("#" + prefix + ":") + chalk.white.bgMagenta(logMessage));
	}

	public static logChainStep(logMessage: string, step: number = -1) {
		if (step === -1) {
			log(chalk.white.bgMagenta(logMessage));
			return;
		}

		if (step == 1) console.log("");
		log(chalk.bold.white.bgBlue("#" + step + ":") + chalk.white.bgMagenta(logMessage));

	}


	public static logMessageHandler(signature: string, data: string) {
		log("Message Handler for " + chalk.green(signature) + " : " + chalk.yellow(data));
	}

	public static dbError(error: any) {
		log(this.error(error));
	}
}
