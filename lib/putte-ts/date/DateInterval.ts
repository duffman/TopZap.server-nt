/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export class DateInterval {
	public static day(): number {
		return 1440;
	}

	public static seconds(val: number): number {
		return val / 60;
	}

	public static hours(val: number): number {
		return val * 60;
	}

	public static days(val: number): number {
		return DateInterval.day() * val;
	}
}
