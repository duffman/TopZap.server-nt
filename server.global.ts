/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

module Global {
	export enum DebugReportingLevel {
		None,
		Low,
		Medium,
		High
	}

	export module Debug {
		export const DebugLevel: DebugReportingLevel = DebugReportingLevel.Low;
		export function Verbose(): boolean {
			return this.DebugLevel == DebugReportingLevel.High;
		}
	}

	export enum ServerMode {
		Debug,
		Test,
		Production
	}

	export let Mode = ServerMode.Debug;
	export let DebugMode = (Mode == ServerMode.Debug);
}

export { Global };