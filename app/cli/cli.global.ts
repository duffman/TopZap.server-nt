/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export module CliGlobal {
	export let DebugMode = false;
	export enum DebugReportingLevel {
		None,
		Low,
		Medium,
		High,
	}

	export module Debug {
		export const DebugLog = false;
		export const DebugLevel = DebugReportingLevel.Low;
		export function Verbose(): boolean {
			return this.DebugLevel == DebugReportingLevel.High;
		}
	}
}