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
class PStrUtils {
    /**
     * Returns a string of a given length filled with given char value
     * @param {string} char
     * @returns {string}
     */
    static fillChar(charValue, length) {
        let result = "";
        for (let i = 0; i < length; i++) {
            result += charValue;
        }
        return result;
    }
    static isEmpty(str) {
        return (str === undefined) || (!str || 0 === str.length);
    }
    static isNumeric(value) {
        value = PStrUtils.isEmpty(value) ? "" : value;
        return value.match(/^[0-9]+$/) != null;
    }
    static replaceStr(source, find, replaceWith) {
        return source.replace(find, String(replaceWith));
    }
}
PStrUtils.replaceEx = function (originalString, oldValue, newValue, ignoreCase = false) {
    //
    // if invalid vendorBaskets, return the original string
    //
    if ((originalString == null) || (oldValue == null) || (newValue == null) || (oldValue.length == 0))
        return (originalString);
    //
    // set search/replace flags
    //
    let Flags = (ignoreCase) ? "gi" : "g";
    //
    // apply regex escape sequence on pattern (oldValue)
    //
    let pattern = oldValue.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    //
    // replace oldValue with newValue
    //
    let str = originalString.replace(new RegExp(pattern, Flags), newValue);
    return str;
};
exports.PStrUtils = PStrUtils;
