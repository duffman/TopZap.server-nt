"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
exports.__esModule = true;
var SessionEntry = /** @class */ (function () {
    function SessionEntry(id, data, created) {
        if (data === void 0) { data = null; }
        if (created === void 0) { created = new Date(); }
        this.id = id;
        this.data = data;
    }
    return SessionEntry;
}());
exports.SessionEntry = SessionEntry;
