/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ErrorConvert }           from './zap-error-result';
import { GetZapError }            from './zap-error-result';
import { IZapErrorResult }        from './zap-error-result';
import { ZapErrorResult }         from './zap-error-result';
import toZapError                 = ErrorConvert.toZapError;

export class Test {

	constructor() {
		let data = '{"code": 6667, "message": "error-getting-item"}';

		let errData = GetZapError(data);
		console.log("ErrData", errData);

	}

	public tryData(data: any): boolean {
		let errData = GetZapError(data);


		console.log("ErrData :: raw", errData);
		console.log("ErrData :: isErr", errData !== null);

		return errData instanceof ZapErrorResult;
	}

}

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
