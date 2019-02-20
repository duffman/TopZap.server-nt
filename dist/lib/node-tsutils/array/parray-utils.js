"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
const pstr_utils_1 = require("@putte/pstr-utils");
class PArrayUtils {
    /**
     * Iterates through given array including child/sub arrays
     * looking for non empty values,
     * @param {Array<any>} arr
     * @returns {boolean}
     */
    static arrHaveChildValue(arr) {
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            if (child instanceof Array) {
                PArrayUtils.arrHaveChildValue(child);
            }
            else {
                if (!pstr_utils_1.PStrUtils.isEmpty(child)) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.PArrayUtils = PArrayUtils;
