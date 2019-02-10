/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const LowPortNum = 3000;
const HighPortNum = 10000;

export class RandomPortGenerator {
	public static get(rangeStart: number = -1, rangeEnd: number = -1): number {
		if (rangeStart < 1) {
			rangeStart = LowPortNum;
		}

		if (rangeEnd < 1) {
			rangeEnd = HighPortNum;
		}

		if (rangeEnd < rangeStart) {
			rangeEnd = rangeStart = + LowPortNum;
		}

		return Math.floor(Math.random() * rangeEnd) + rangeStart;
	}
}
