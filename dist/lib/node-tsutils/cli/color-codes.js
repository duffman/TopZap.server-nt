"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var CliColors;
(function (CliColors) {
    const isWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');
    CliColors.CliReset = "\x1b[0m";
    CliColors.CliBright = "\x1b[1m";
    CliColors.CliDim = "\x1b[2m";
    CliColors.CliUnderscore = "\x1b[4m";
    CliColors.CliBlink = "\x1b[5m";
    CliColors.CliReverse = "\x1b[7m";
    CliColors.CliHidden = "\x1b[8m";
    CliColors.CliFgBlack = "\x1b[30m";
    CliColors.CliFgRed = "\x1b[31m";
    CliColors.CliFgGreen = "\x1b[32m";
    CliColors.CliFgYellow = "\x1b[33m";
    CliColors.CliFgBlue = "\x1b[34m";
    CliColors.CliFgMagenta = "\x1b[35m";
    CliColors.CliFgCyan = "\x1b[36m";
    CliColors.CliFgWhite = "\x1b[37m";
    CliColors.CliBgBlack = "\x1b[40m";
    CliColors.CliBgRed = "\x1b[41m";
    CliColors.CliBgGreen = "\x1b[42m";
    CliColors.CliBgYellow = "\x1b[43m";
    CliColors.CliBgBlue = "\x1b[44m";
    CliColors.CliBgMagenta = "\x1b[45m";
    CliColors.CliBgCyan = "\x1b[46m";
    CliColors.CliBgWhite = "\x1b[47m";
})(CliColors = exports.CliColors || (exports.CliColors = {}));
