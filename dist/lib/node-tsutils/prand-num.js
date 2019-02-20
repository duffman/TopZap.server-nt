"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PRandNum {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static randomNum(length = 8) {
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
exports.PRandNum = PRandNum;
