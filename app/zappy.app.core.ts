/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { IZappyApp }              from "@app/zappy.app";

export class ZappyAppCore implements IZappyApp {
	debugMode: boolean;

	version: string = "0.7.1";
	getAppVersion(): string {
		return "topzap.node.api/" + this.version;
	}

	getSecret(): string {
		return "ZapApp-Node-API/WillyW0nka";
	}
}