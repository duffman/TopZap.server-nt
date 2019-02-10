/*=--------------------------------------------------------------=

 PutteTSNode - Yet Another Typescript Utilities Collection

 Author : Patrik Forsberg
 Email  : patrik.forsberg@coldmind.com
 GitHub : https://github.com/duffman
 Date   : 2018-11-01

 Use this software free of charge, the only thing I ask is that
 you obey to the terms stated in the license, i would also like
 you to keep the file header intact.

 This software is subject to the LGPL v2 License, please find
 the full license attached in LICENCE.md

 =----------------------------------------------------------------= */

import {CliCommander} from '@cli/cli.commander';

export class PVarUtils {

	public static isNothing(value: any): boolean {
		return value ? true: false;
	}

	public static isNullOrUndefined(value: any): boolean {
		return value === null || value === undefined;
	}

	public static isNumber(value: any): boolean {
		return typeof value === "number";
	}

	public static isValidNumber(value: any): boolean {
		let result = false;
		if (value !== null) {
			let strVal = value.toString();
			let numVal = parseFloat(strVal);

			result = PVarUtils.isNumber(numVal);
		}

		return result;
	}
}

if (CliCommander.haveArgs()) {
	console.log("OUTSIDE CODE EXECUTING");
	console.log("Test1 ::", PVarUtils.isNumber("123"));
	console.log("Test2 ::", PVarUtils.isNumber(null));
	console.log("Test3 ::", PVarUtils.isNumber(123.34));
	console.log("Test4 ::", PVarUtils.isNumber(1));
}