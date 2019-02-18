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
const pstr_utils_1 = require("@putte/pstr-utils");
const pvar_utils_1 = require("@putte/pvar-utils");
const pvar_types_1 = require("@putte/pvar-types");
const parray_utils_1 = require("@putte/array/parray-utils");
class PArrayPurge {
    /**
     * Remove null elements
     * @param {Array<any>} input array
     * @returns {any[]} - resulting array
     */
    arrPurgeNull(arr) {
        let result = arr.filter((element) => {
            return element != null;
        });
        return result;
    }
    /**
     * Remove elements which are nada or empty string
     * @param {Array<any>} input array
     * @returns {any[]} - resulting array
     */
    static arrPurgeNullOrEmpty(arr) {
        let result = arr.filter((element) => {
            return pstr_utils_1.PStrUtils.isEmpty(element);
        });
        return result;
    }
    /**
     * Remove elements which are null, undefined, empty...
     * @param {Array<any>} arr
     * @param {boolean} purgeNullArrays - if set arrays containing only null values
     *                                    (including child arrays will be purged
     * @param {boolean} purgeBool - if set - false bool values will be purged
     * @returns {Array<any>}
     */
    static purge(arr, purgeNullArrays = true, purgeBool = false) {
        function doPurge(value) {
            let purge = false;
            let valType = pvar_utils_1.PVarUtils.getVarType(value);
            console.log("valType ::", pvar_types_1.PVarTypeToStr(valType));
            switch (valType) {
                case pvar_types_1.PVarType.Null:
                    purge = true;
                    console.log("Null :: qualify ::", purge);
                    break;
                case pvar_types_1.PVarType.Undefined:
                    purge = true;
                    console.log("Undefined :: qualify ::", purge);
                    break;
                case pvar_types_1.PVarType.String:
                    purge = value.length === 0;
                    console.log("String :: purge ::", purge);
                    break;
                case pvar_types_1.PVarType.Number:
                    purge = value < 0;
                    console.log("DBG::", value);
                    console.log("Number :: qualify ::", purge);
                    break;
                case pvar_types_1.PVarType.Bool:
                    purge = purgeBool && !value;
                    console.log("Bool :: purge ::", purge);
                    break;
                case pvar_types_1.PVarType.Array:
                    let arrVal = value;
                    purge = (arrVal.length === 0) ||
                        (purgeNullArrays && !parray_utils_1.PArrayUtils.arrHaveChildValue(arrVal));
                    console.log("\n###Array :: purge ::", purge);
                    break;
            }
            return !purge;
        }
        let result = arr.filter((element) => {
            return doPurge(element);
        });
        return result;
    }
}
exports.PArrayPurge = PArrayPurge;
