/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export class PRandNum {

	public static getRandomInt(min: number, max: number): number {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}

	public static randomNum(length: number = 8): string {
		return new Date().getTime().toString() + PRandNum.getRandomInt(10, 44);
		/*
		let timestamp = +new Date;

		let ts = timestamp.toString();
		let parts = ts.split("").reverse();
		let id = "";

		for (let i = 0; i < this.length; ++i ) {
			let index = PRandNum.getRandomInt(0, parts.length - 1 );
			id += parts[index];
		}

		return id;
		*/
	}
}