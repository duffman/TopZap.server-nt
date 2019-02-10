/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


let args = process.argv.slice(2);
let haveArgs = args.length === 3;
let cmd = "";

if (haveArgs) {
	cmd = args[0];
}

export class IgniterCli {
	public static startHub(): boolean {
		return (haveArgs && cmd === "hub");
	}

	public static startClient(): boolean {
		return (haveArgs && cmd === "client");
	}

	public static startServer(): boolean {
		return (haveArgs && cmd === "server");
	}
}
