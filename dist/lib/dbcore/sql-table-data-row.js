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
const sql_data_column_1 = require("./sql-data-column");
const data_point_1 = require("./data-point");
const var_utils_1 = require("./data/var-utils");
class SQLTableDataRow {
    constructor(obj) {
        this.isEmpty = false;
        this.columns = new Array();
        if (!var_utils_1.DbVarUtils.isDefined(obj)) {
            this.parseData(obj);
        }
    }
    parseData(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.columns.push(new sql_data_column_1.SQLDataColumn(key, obj[key]));
            }
        }
    }
    getColumn(key) {
        for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            if (column.name == key) {
                return column;
            }
        }
        return null;
    }
    count() {
        return this.columns.length;
    }
    emptyValue(key) {
        let column = this.getColumn(key);
        if (column != null)
            column.value = null;
    }
    getValAsStr(key) {
        let column = this.getColumn(key);
        return column != null ? column.value : null;
    }
    getValAsCVPoint(key) {
        let column = this.getColumn(key);
        let res = column != null ? column.value : null;
        return new data_point_1.DataPoint(0, 0);
    }
    getValAsNum(key) {
        let value = this.getValAsStr(key);
        if (value != null) {
            return parseInt(value);
            //return Number(value);
        }
        return -1;
    }
    /**
     * Makes an optimistic attempt to parse a JS date from given string
     * @param {string} key
     * @returns {Date}
     *
    public getValAsDate(key: string): Date {
        return res;
    }
    */
    getValAsInt(key) {
        return this.getValAsNum(key);
    }
    toJson() {
        let data = this.columns != null ? this.columns : "NULL";
        return JSON.stringify(data);
    }
}
exports.SQLTableDataRow = SQLTableDataRow;
