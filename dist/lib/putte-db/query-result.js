"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryResult {
    constructor(tableData = null, error = null) {
        this.tableData = tableData;
        this.error = error;
    }
}
exports.QueryResult = QueryResult;
