/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface IGCAPTCHAResult {
	success?:       boolean;
	"error-codes"?: string[];
}

// Converts JSON strings to/from your types
export namespace GCAPTCHAResult {
	export function toIGCAPTCHAResult(json: string): IGCAPTCHAResult {
		return JSON.parse(json);
	}

	export function iGCAPTCHAResultToJson(value: IGCAPTCHAResult): string {
		return JSON.stringify(value);
	}
}
