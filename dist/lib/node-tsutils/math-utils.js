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
class MathUtilities {
    /**
     * Sum all value in an array of numbers
     * @param {Array<number>} numArray
     * @returns {number}
     */
    static sumNumArray(numArray) {
        let result = 0;
        for (let i = 0; i < numArray.length; i++) {
            result = (result + numArray[i]);
        }
        return result;
    }
    /**
     * Perform a weigther random
     * @param {Array<string>} values
     * @param {Array<number>} weights
     * @returns {string}
     */
    static weightedRandom(values, weights) {
        let sum = MathUtilities.sumNumArray(weights);
        let rand = Math.floor(Math.random() * sum) + 1;
        let i = 0;
        let n = 0;
        while (i < values.length) {
            n = (n + weights[i]);
            if (n >= rand) {
                break;
            }
            i++;
        }
        return values[i];
    }
}
exports.MathUtilities = MathUtilities;
