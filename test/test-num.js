/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var str1 = "10.43";
var str2 = "10,43";
function parseOffer(input) {
    input = input.replace(",", ".");
    return parseFloat(input);
}
var num1 = parseOffer(str1);
var num2 = parseOffer(str2);
console.log("Num 1 ::", num1);
console.log("Num 2 ::", num2);
