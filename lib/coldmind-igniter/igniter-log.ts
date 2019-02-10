/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export class Log {
	public static _baseLog(prefix: string, message: string, data: any = null): void {
		if (data) {
			console.log(`${prefix} :: ${message} ::`, data);
		} else {
			console.log(`${prefix}  :: ${message}`);
		}
	}

	public static debug(message: string, data: any = null): void {
		Log._baseLog("DBG", message, data);
	}

	public static info(message: string, data: string = ""): void {
		if (data && data.length > 0) {
			console.log(`INFO :: ${message} ::`, data);
		} else {
			console.log(`INFO :: ${message}`);
		}
	}


	public static data(message: string, data: any = null): void {
		if (data !== null) {
			console.log(`DATA :: ${message} ::`, data);
		} else {
			console.log(`DATA :: ${message}`);
		}
	}

	public static error(message: string, err: Error = null): void {
		if (err !== null) {
			console.log(`ERR :: ${message} ::`, err);
		} else {
			console.log(`ERR :: ${message}`);
		}
	}
}
