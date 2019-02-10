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


export module CliColors {
	const isWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

	export const CliReset = "\x1b[0m";
	export const CliBright = "\x1b[1m";
	export const CliDim = "\x1b[2m";
	export const CliUnderscore = "\x1b[4m";
	export const CliBlink = "\x1b[5m";
	export const CliReverse = "\x1b[7m";
	export const CliHidden = "\x1b[8m";

	export const CliFgBlack = "\x1b[30m";
	export const CliFgRed = "\x1b[31m";
	export const CliFgGreen = "\x1b[32m";
	export const CliFgYellow = "\x1b[33m";
	export const CliFgBlue = "\x1b[34m";
	export const CliFgMagenta = "\x1b[35m";
	export const CliFgCyan = "\x1b[36m";
	export const CliFgWhite = "\x1b[37m";

	export const CliBgBlack = "\x1b[40m";
	export const CliBgRed = "\x1b[41m";
	export const CliBgGreen = "\x1b[42m";
	export const CliBgYellow = "\x1b[43m";
	export const CliBgBlue = "\x1b[44m";
	export const CliBgMagenta = "\x1b[45m";
	export const CliBgCyan = "\x1b[46m";
	export const CliBgWhite = "\x1b[47m";
}