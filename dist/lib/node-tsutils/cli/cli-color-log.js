"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_codes_1 = require("@putte/cli/color-codes");
var CliFgRed = color_codes_1.CliColors.CliFgRed;
var CliBright = color_codes_1.CliColors.CliBright;
var CliReset = color_codes_1.CliColors.CliReset;
class CliColorLog {
    CliLogColor(str) {
        /*
        str = code.open + str.replace(code.closeRe, code.open) + code.close;

        // Close the styling before a linebreak and reopen
        // after next line to fix a bleed issue on macOS
        // https://github.com/chalk/chalk/pull/92
        str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
        */
    }
    static LogBrightRed(text, data) {
        console.log(CliBright, CliFgRed, text, data, CliReset);
    }
}
exports.CliColorLog = CliColorLog;
