"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ZapErrorResult {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
exports.ZapErrorResult = ZapErrorResult;
var ErrorConvert;
(function (ErrorConvert) {
    function toZapError(json) {
        return JSON.parse(json);
    }
    ErrorConvert.toZapError = toZapError;
    function zapErrorToJson(value) {
        return JSON.stringify(value);
    }
    ErrorConvert.zapErrorToJson = zapErrorToJson;
})(ErrorConvert = exports.ErrorConvert || (exports.ErrorConvert = {}));
function GetZapError(data) {
    let result = null;
    if (data === null) {
        return result;
    }
    let strRep = JSON.stringify(data);
    return ErrorConvert.toZapError(strRep);
}
exports.GetZapError = GetZapError;
