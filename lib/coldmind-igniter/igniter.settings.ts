/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export module IgniterSettings {
	export const DefSocketPath = "igniter";
	export const DefSocketServerPort = 3700;
	export const ColdindNet = 'http://localhost:9090';
	export const ReConnectInterval: number = 2000;

	export module Gatling {
		export const GATLING_DISCOVERY_HOST: string = '127.0.0.1';
		export const GATLING_DISCOVERY_PORT: number = 33333;
	}
}
