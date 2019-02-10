/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger }                 from '@cli/cli.logger';
import { CliErrorCodes }          from '@cli/cli.error-codes';

export class CliDebugYield {
	public static fatalError(message: string, err: any, die: boolean = false) {
		let jsonErr = JSON.stringify(err);
		Logger.logFatalError(message, new Error(jsonErr));

		if (die) {
			process.exit(CliErrorCodes.FATAL_ERROR);
		}
	}
}
