/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {ISessionEntry, SessionEntry} from '../app/components/session-igniter/session-igniter-entry';


let sessEntry = new SessionEntry("balle", {kalle: "kula"});

console.log(sessEntry);
console.log("");
console.log(typeof sessEntry);


function isSessionEntry(obj: any): boolean {
	let result = false;
	let objType = typeof obj;

	if (objType === "object") {
		result = (obj.hasOwnProperty("id")) && obj.hasOwnProperty("data");
	}

	return result;
}


console.log(isSessionEntry(sessEntry));
console.log(isSessionEntry({isd: "allan"}));