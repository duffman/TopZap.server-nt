"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const zap_error_result_1 = require("./zap-error-result");
const zap_error_result_2 = require("./zap-error-result");
class Test {
    constructor() {
        let data = '{"code": 6667, "message": "error-getting-item"}';
        let errData = zap_error_result_1.GetZapError(data);
        console.log("ErrData", errData);
    }
    tryData(data) {
        let errData = zap_error_result_1.GetZapError(data);
        console.log("ErrData :: raw", errData);
        console.log("ErrData :: isErr", errData !== null);
        return errData instanceof zap_error_result_2.ZapErrorResult;
    }
}
exports.Test = Test;
/*
let args = process.argv.slice(2);
console.log("args", args);

if (args[0] === "test") {
    let testa = new Test();

    console.log(" ");
    console.log("--");
    let cp = {kalle: "balle"};
    testa.tryData(cp);
    console.log(" ");
    console.log("--");

    let objData = toZapError('{"code": 6667, "message": "error-getting-item"}');


    console.log("OBJ IS TYPE ::", typeof  objData);
    let cp2 = GetZapError(objData);

    testa.tryData('{"code": 6667, "message": "error-getting-item"}');
    testa.tryData(cp);

}
*/
