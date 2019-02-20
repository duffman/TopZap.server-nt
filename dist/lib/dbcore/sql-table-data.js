"use strict";
/**
 * COLDMIND LTD ("COMPANY") CONFIDENTIAL
 * Unpublished Copyright (c) 2015-2017 COLDMIND LTD, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of COMPANY. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current COMPANY employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg on 2017
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sql_table_data_row_1 = require("./sql-table-data-row");
const sql_data_column_1 = require("./sql-data-column");
class SQLTableData {
    constructor() {
        this.fieldTypes = {};
        this.dataRows = Array();
    }
    rowCount() {
        return this.dataRows != null ? this.dataRows.length : 0;
    }
    parseFields(fields) {
        for (let index in fields) {
            let obj = fields[index];
            let name = "";
            let type = "";
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (prop === "name")
                        name = obj[prop];
                    if (prop === "type")
                        type = obj[prop];
                }
            }
            this.fieldTypes[name] = Number(type);
        }
    }
    addRow() {
        let newRow = new sql_table_data_row_1.SQLTableDataRow();
        this.dataRows.push(newRow);
        return newRow;
    }
    // Patrik, Dec 18 2017: Added in order to support Unit Test
    pushRow(row) {
        this.dataRows.push(row);
    }
    /**
     * Returns the first row in result
     * @param safe - if set to true a non null result is  guaranteed
     * @returns {SQLTableDataRow}
     */
    safeGetFirstRow() {
        let result = this.dataRows[0];
        if (result == null) {
            result = new sql_table_data_row_1.SQLTableDataRow();
        }
        return result;
    }
    getFirstRow() {
        return this.dataRows[0];
    }
    parseRowCollection(dataRows) {
        function parseRow(dataRow, dbDataRow) {
            for (let cell in dataRow) {
                if (dataRow.hasOwnProperty(cell)) {
                    let rowObj = dataRow[cell];
                    dbDataRow.columns.push(new sql_data_column_1.SQLDataColumn(cell, rowObj));
                }
            }
        }
        for (let i = 0; i < dataRows.length; i++) {
            let row = dataRows[i];
            let dbDataRow = this.addRow();
            parseRow(row, dbDataRow);
        }
    }
    parseResultSet(dataRows, dataFields) {
        //console.log("dataRows:", dataRows);
        //console.log("dataFields:", dataFields);
        return new Promise((resolve, reject) => {
            try {
                this.parseFields(dataFields);
                this.parseRowCollection(dataRows);
            }
            catch (e) {
                reject(e);
            }
            resolve(this);
        });
    }
    toString() {
        let result = "";
        /*
        for (var r in this.rows) {
            for (var col in r.columns) {
                result += col.key + ": " + col.value + "\n";
            }
            result += "-----------------\n";
        }
        */
        return result;
    }
}
exports.SQLTableData = SQLTableData;
