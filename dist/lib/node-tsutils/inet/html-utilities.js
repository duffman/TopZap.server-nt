"use strict";
/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
//import * as striptags from "striptags";
class HtmlUtilities {
    static stripTags(htmlData) {
        return htmlData.replace(/(<([^>]+)>)/ig, "");
        //return striptags(input);
    }
}
exports.HtmlUtilities = HtmlUtilities;
