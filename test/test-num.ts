/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


let str1 = "10.43";
let str2 = "10,43";

function parseOffer(input: string): Number {
	input = input.trim().replace(",", ".");
	return parseFloat(input);
}

let num1 = parseOffer(str1);
let num2 = parseOffer(str2);

console.log("Num 1 ::", num1);
console.log("Num 2 ::", num2);