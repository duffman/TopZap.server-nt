"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Converts JSON strings to/from your types
var GCAPTCHAResult;
(function (GCAPTCHAResult) {
    function toIGCAPTCHAResult(json) {
        return JSON.parse(json);
    }
    GCAPTCHAResult.toIGCAPTCHAResult = toIGCAPTCHAResult;
    function iGCAPTCHAResultToJson(value) {
        return JSON.stringify(value);
    }
    GCAPTCHAResult.iGCAPTCHAResultToJson = iGCAPTCHAResultToJson;
})(GCAPTCHAResult = exports.GCAPTCHAResult || (exports.GCAPTCHAResult = {}));
