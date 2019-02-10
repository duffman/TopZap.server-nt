"use strict";
exports.__esModule = true;
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var session_igniter_entry_1 = require("../app/components/session-igniter/session-igniter-entry");
var sessEntry = new session_igniter_entry_1.SessionEntry("balle", { kalle: "kula" });
console.log(sessEntry);
console.log("");
console.log(typeof sessEntry);
function isSessionEntry(obj) {
    var result = false;
    var objType = typeof obj;
    if (objType === "object") {
        result = (obj.hasOwnProperty("id")) && obj.hasOwnProperty("data");
        /*
        
        
                let typedEntry = obj as ISessionEntry;
                result = typedEntry !== null;
        
                console.log("WE ARE here", typedEntry);
        
                console.log("WE ARE here", typedEntry);
                */
    }
    return result;
}
console.log(isSessionEntry(sessEntry));
console.log(isSessionEntry({ isd: "allan" }));
