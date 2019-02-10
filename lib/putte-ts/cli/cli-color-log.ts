

import { CliColors } from "@putte/cli/color-codes";
import CliFgRed = CliColors.CliFgRed;
import CliBright = CliColors.CliBright;
import CliReset = CliColors.CliReset;

export class CliColorLog {


	public CliLogColor(str: string) {
		/*
		str = code.open + str.replace(code.closeRe, code.open) + code.close;

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
		*/
	}

	public static LogBrightRed(text: string, data: any) {
		console.log(CliBright, CliFgRed, text, data, CliReset);
	}
}
