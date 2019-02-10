/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const args = process.argv.slice(2);

export class CliCommander {

	public static haveArgs(): boolean {
		return args.length > 0;
	}

	public static compareParam(param1: string, param2: string, ignoreCase: boolean = true): boolean {
		param1 = param1 === undefined ? "" : param1;
		param2 = param2 === undefined ? "" : param2;

		if (ignoreCase) {
			param1 = param1.toLowerCase();
			param2 = param2.toLowerCase();
		}
		return (param1.localeCompare(param2) === 0);
	}

	public static getParamAt(index: number): string {
		if (index > -1 && index <= args.length) {
			return args[index];
		} else {
			return "";
		}
	}

	public static getFirst(): string {
		return CliCommander.getParamAt(0);
	}

	public static getSecond(): string {
		return CliCommander.getParamAt(1);
	}

	public static first(paramName: string, ignoreCase: boolean = true): boolean {
		let firstParam = CliCommander.getParamAt(0);
		return CliCommander.compareParam(CliCommander.getFirst(), paramName, ignoreCase);
	}

	public static second(paramName: string, ignoreCase: boolean = true): boolean {
		let firstParam = CliCommander.getParamAt(1);
		return CliCommander.compareParam(CliCommander.getFirst(), paramName, ignoreCase);
	}

	public static debug(): boolean {
		return CliCommander.getFirst() === "debug";
	}

	public parseCliArgs(args: any): void {

	}
}
