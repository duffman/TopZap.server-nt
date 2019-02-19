"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DateInterval {
    static day() {
        return 1440;
    }
    static seconds(val) {
        return val / 60;
    }
    static hours(val) {
        return val * 60;
    }
    static days(val) {
        return DateInterval.day() * val;
    }
}
exports.DateInterval = DateInterval;
