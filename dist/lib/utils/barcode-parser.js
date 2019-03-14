"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * @author Patrik Forsberg
 * @date 2018-11-20
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const pstr_utils_1 = require("@putte/pstr-utils");
class BarcodeParser {
    /**
     * Prepends given string with ZEROS "0" until given length is met
     * @param {string} input
     * @param {number} len
     * @returns {string}
     */
    static prepZeroToLength(input, length) {
        let result = "";
        if (input.length < length) {
            let paddNum = length - input.length;
            let paddStr = "";
            for (let i = 0; i < paddNum; i++) {
                paddStr += "0";
            }
            result = (paddStr + input);
        }
        else {
            return input;
        }
        return result;
    }
    /**
     * If the given code is shorter than 13, it will be
     * pre padded with zeros to length 13
     * @param {string} input
     * @param {boolean} strict - if set to string the given string will be validated
     * @returns {string}
     */
    static prepEan13Code(input, strict = false) {
        if (strict && !(input.match(/^[0-9]+$/) != null)) {
            return pstr_utils_1.PStrUtils.fillChar("0", 13);
        }
        else {
            return BarcodeParser.prepZeroToLength(input, 13);
        }
    }
    validateEan(eanCode) {
        let validChars = eanCode.match(/^[0-9]+$/) != null;
        // Add five 0 if the code has only 8 digits
        if (eanCode.length == 8) {
            eanCode = BarcodeParser.prepEan13Code(eanCode);
        }
        // Check for 13 digits otherwise
        else if (eanCode.length != 13) {
            return false;
        }
        // Get the check number
        let originalCheck = eanCode.substring(eanCode.length - 1);
        eanCode = eanCode.substring(0, eanCode.length - 1);
        // Add even numbers together
        let even = Number(eanCode.charAt(1)) +
            Number(eanCode.charAt(3)) +
            Number(eanCode.charAt(5)) +
            Number(eanCode.charAt(7)) +
            Number(eanCode.charAt(9)) +
            Number(eanCode.charAt(11));
        // Multiply this result by 3
        even *= 3;
        // Add odd numbers together
        let odd = Number(eanCode.charAt(0)) +
            Number(eanCode.charAt(2)) +
            Number(eanCode.charAt(4)) +
            Number(eanCode.charAt(6)) +
            Number(eanCode.charAt(8)) +
            Number(eanCode.charAt(10));
        // Add two totals together
        let total = even + odd;
        // Calculate the checksum
        // Divide total by 10 and set the remainder
        let checksum = total % 10;
        // If result is not 0 then take away 10
        if (checksum != 0) {
            checksum = 10 - checksum;
        }
        // Return the result
        return checksum == Number(originalCheck);
    }
}
exports.BarcodeParser = BarcodeParser;
