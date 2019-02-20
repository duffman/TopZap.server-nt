"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sql_table_data_1 = require("./sql-table-data");
const sql_table_data_row_1 = require("./sql-table-data-row");
const util_1 = require("util");
class DbResult {
    constructor(result = null) {
        this.result = result;
        this.success = true;
        this.error = null;
        this.lastInsertId = 0;
        this.setRawObj();
    }
    errorMessage() {
        return "";
    }
    haveAny() {
        return this.result.rowCount() > 0;
    }
    /**
     * Store a raw JavaScript object representation of the data
     * TODO: Clean up this hack!!
     */
    setRawObj() {
        if (this.result == null || this.result[0] == null)
            return;
        let obj = this.result[0];
        let empty = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let camelKey = key; //PascalSnake.toPascalCase(key, true);
                empty[camelKey] = obj[key];
            }
        }
        this.rawObj = empty;
    }
    /**
     * Always return a SQLTableDataRow
     * If a SQLTableData result is present containing
     * one or more rows, the first row will be returned
     * otherwize a new SQLTableDataRow will be created.
     */
    safeGetFirstRow() {
        let tableDataRow;
        let isObj = this.result != null && !util_1.isUndefined(this.result);
        let isTableData = this.result instanceof sql_table_data_1.SQLTableData;
        if (isObj && isTableData && this.result.dataRows.length > 0) {
            tableDataRow = this.result.getFirstRow();
        }
        else {
            tableDataRow = new sql_table_data_row_1.SQLTableDataRow();
            tableDataRow.isEmpty = true;
        }
        return tableDataRow;
    }
    setError(err) {
        if (err !== null) {
            this.error = err;
            this.success = false;
        }
    }
}
exports.DbResult = DbResult;
