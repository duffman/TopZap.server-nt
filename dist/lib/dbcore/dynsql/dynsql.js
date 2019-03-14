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
const util_1 = require("util");
const util_2 = require("util");
const util_3 = require("util");
const records_1 = require("./records");
const sql_string_1 = require("./sql-string");
// Keywords
const DB_INSERT = "INSERT";
const DB_MYSQL_REPLACE = "REPLACE";
const DB_SELECT = "SELECT";
const DB_UPDATE = "UPDATE";
const DB_DELETE = "DELETE";
const DB_FROM = "FROM";
const DB_WHERE = "WHERE";
const DB_SET = "SET";
const DB_DROP = "DROP";
var WhereType;
(function (WhereType) {
    WhereType[WhereType["Between"] = 0] = "Between";
    WhereType[WhereType["Or"] = 1] = "Or";
    WhereType[WhereType["In"] = 2] = "In";
})(WhereType = exports.WhereType || (exports.WhereType = {}));
var DataType;
(function (DataType) {
    DataType[DataType["VarChar"] = 0] = "VarChar";
    DataType[DataType["Boolean"] = 1] = "Boolean";
    DataType[DataType["Int"] = 2] = "Int";
    DataType[DataType["Date"] = 3] = "Date";
})(DataType = exports.DataType || (exports.DataType = {}));
function prepMySQLDate(dateObj) {
    dateObj.setHours(dateObj.getHours() - 2);
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
}
class DataColumn {
    constructor(value) {
        this.value = value;
    }
}
exports.DataColumn = DataColumn;
/**
 * Simple Active Record implementation
 * Note: This does not add any intelligens, stupid behaviour such
 * as calling an SELECT after a SET, broken SQL will remain broken :)
 */
class DynSQL {
    constructor(dbName = "") {
        this.dbName = dbName;
        this.records = new Array();
    }
    /**
     * For this sucker I actually performed a series of
     * performance benchmarks, this is (at least for this
     * app) the fastest and the most
     */
    clear() {
        this.records.length = 0;
    }
    /**
     * Returns the previous record from a given
     * record in the record array
     * @param {IDRecord} record
     * @returns {IDRecord}
     */
    getPreviousRecord(record) {
        let result = null;
        let index = this.records.indexOf(record);
        if (index > -1 && index - 1 > 0) {
            result = this.records[index];
        }
        return result;
    }
    selectAll(...elements) {
        for (let item in elements) {
            let name = elements[item];
            this.records.push(new records_1.DSelectAll(name));
        }
        return this;
    }
    select(...elements) {
        for (let item in elements) {
            let name = elements[item];
            this.records.push(new records_1.DSelect(name));
        }
        return this;
    }
    update(table) {
        this.records.push(new records_1.DUpdate(table));
        return this;
    }
    insert(data, tableName) {
        this.records.push(new records_1.DInsert(data, tableName));
        return this;
    }
    with(...data) {
        this.records.push(new records_1.DWith(data));
        return this;
    }
    into(tableName) {
        this.records.push(new records_1.DInto(tableName));
        return this;
    }
    set(column, value, escape = true) {
        this.records.push(new records_1.DSet(column, value));
        return this;
    }
    leftJoin(table, on) {
        this.records.push(new records_1.DLeftJoin(table, on));
        return this;
    }
    selectAs(fromTable, alias = null) {
        this.records.push(new records_1.DSelect(fromTable, alias));
        return this;
    }
    from(table, alias = null) {
        let rec = new records_1.DFrom(table, alias);
        this.records.push(rec);
        return this;
    }
    prepValue(value) {
        if (util_1.isString(value)) {
            value = "'" + value + "'";
        }
        else if (util_2.isNumber(value)) {
            value = String(value);
        }
        else if (util_3.isDate(value)) {
            value = prepMySQLDate(value);
        }
        return value;
    }
    /**
     * Adds a Where record to the active record stack
     * @param thisElem
     * @param elemIs
     * @param escapeValue - set this to true when handling user inputted values, false when like "lucas.arts=rulez.row"
     * @returns {DynSQL}
     */
    where(thisElem, elemIs = null, escapeValue = true) {
        let equalValue = escapeValue ? this.prepValue(elemIs) : elemIs;
        let rec = new records_1.DWhere(thisElem, equalValue);
        this.records.push(rec);
        return this;
    }
    // withintrig
    whereBetween(value, rangeStart, rangeEnd) {
        this.prepValue(value);
        let rec = new records_1.DWhereExt(WhereType.Between, value, rangeStart, rangeEnd);
        this.records.push(rec);
        return this;
    }
    orderBy(col) {
        let rec = new records_1.DOrderBy(col);
        this.records.push(rec);
        return this;
    }
    orderByRandom() {
        let rec = new records_1.DOrderBy("RAND()");
        this.records.push(rec);
        return this;
    }
    and(col, equals = null) {
        let rec = new records_1.DAnd(col, equals);
        this.records.push(rec);
        return this;
    }
    limitBy(fromValue, toValue = null) {
        let rec = new records_1.DLimit(fromValue, toValue);
        this.records.push(rec);
        return this;
    }
    /**
     * Checks whether a given record position contains a
     * given instance type.
     * @param recordNum
     * @param recordInstanceType
     */
    isExpectedRecord(recordNum, recordInstanceType) {
        let isExpected = false;
        let inRange = (recordNum <= this.records.length && recordNum >= 0);
        if (inRange && (this.records[recordNum] instanceof recordInstanceType)) {
            isExpected = true;
        }
        return isExpected;
    }
    toSQL() {
        let sql = "";
        /**
         * Iterate the array on loopback for each type, that´s the most system
         * efficient and readable, don´t getAs confused by compiler masturbations
         * and smart array functions, they will boil down to something much
         * worse if you look behind the curtain.
         */
        sql = this.parseInsert(sql);
        sql = this.parseSelect(sql);
        sql = this.parseSelectAll(sql);
        sql = this.parseUpdate(sql);
        sql = this.parseSet(sql);
        sql = this.parseFrom(sql);
        sql = this.parseLeftJoin(sql);
        sql = this.parseWhere(sql);
        sql = this.parseAnd(sql);
        sql = this.parseOrderBy(sql);
        sql = this.parseLimit(sql);
        return sql;
    }
    ////////////////////////////////////////
    // SELECT
    escpaeVal(value) {
        let result = value;
        if (value instanceof String) {
            value = sql_string_1.default.escape(value);
            result = `"${value}"`;
        }
        else if (value instanceof Object) {
            value = sql_string_1.default.escape(value);
            result = `"${value}"`;
        }
        return result;
    }
    parseInsert(sql) {
        let record = this.records[0];
        if (!(record instanceof records_1.DInsert))
            return sql;
        const dRec = record;
        let type = dRec.mySQLReplace ? DB_MYSQL_REPLACE : DB_INSERT;
        let colNames = new Array();
        let colValues = new Array();
        let obj = dRec.data;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                colNames.push(key);
                colValues.push(obj[key]);
            }
        }
        for (let i = 0; i < colValues.length; i++) {
            colValues[i] = "'" + this.escpaeVal(colValues[i]) + "'";
        }
        sql = `INSERT INTO ${dRec.tableName} (${colNames.join(",")}) VALUES (${colValues.join(",")})`;
        return sql;
    }
    ////////////////////////////////////////
    // SELECT
    parseSelect(sql) {
        let localCounter = 0;
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record instanceof records_1.DSelect) {
                const dRec = record;
                if (localCounter == 0) {
                    sql += "SELECT";
                }
                else {
                    sql += ",";
                }
                sql += " " + dRec.column;
                localCounter++;
            }
        } // end for
        return sql;
    } // parseSelect
    parseSelectAll(sql) {
        let localCounter = 0;
        for (let i = 0; i < this.records.length; i++) {
            const record = this.records[i];
            if (record instanceof records_1.DSelectAll) {
                const dRec = record;
                if (localCounter == 0) {
                    sql += "SELECT";
                }
                else {
                    sql += ",";
                }
                sql += " " + dRec.column + ".*";
                localCounter++;
            }
        } // end for
        return sql;
    } // parseSelect
    ////////////////////////////////////////
    // FROM
    parseFrom(sql) {
        let localCounter = 0;
        for (let i = 0; i < this.records.length; i++) {
            const record = this.records[i];
            if (record instanceof records_1.DFrom) {
                const rec = record;
                if (localCounter == 0) {
                    sql += " FROM";
                }
                else {
                    sql += ",";
                }
                sql += " " + rec.table;
                if (rec.alias != null) {
                    sql += " AS " + rec.alias;
                }
                localCounter++;
            }
        }
        return sql;
    } // parseFrom
    ////////////////////////////////////////
    // UPDATE
    parseUpdate(sql) {
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record instanceof records_1.DUpdate) {
                const rec = record;
                sql += "UPDATE " + rec.table;
                break;
            }
        }
        return sql;
    }
    ////////////////////////////////////////
    // SET
    parseSet(sql) {
        let rec;
        let localCounter = 0;
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record instanceof records_1.DSet) {
                rec = record;
                if (localCounter == 0) {
                    sql += " SET";
                }
                else {
                    sql += " ,";
                }
                let val = rec.escape ? this.prepValue(rec.value) : rec.value;
                sql += " " + rec.column + "='" + val + "'";
                localCounter++;
            }
        } // end for
        return sql;
    } // parseSet
    ////////////////////////////////////////
    // LEFT JOIN
    parseLeftJoin(sql) {
        const localCounter = 0;
        for (let i = 0; i < this.records.length; i++) {
            const record = this.records[i];
            if (record instanceof records_1.DLeftJoin) {
                const rec = record;
                sql += " LEFT JOIN "
                    + rec.table + " ON "
                    + rec.on;
            }
        }
        return sql;
    } // parseLeftJoin
    ////////////////////////////////////////
    // WHERE
    isWhereRecord(record) {
        return (record instanceof records_1.DWhere || record instanceof records_1.DWhereExt);
    }
    parseWhere(sql) {
        let firstIteration = true;
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (!this.isWhereRecord(record))
                continue;
            if (firstIteration) {
                sql += " WHERE";
            }
            else {
                sql += " AND";
            }
            let rec;
            if (record instanceof records_1.DWhereExt) {
                rec = record;
                sql += " " + rec.that + " BETWEEN '" + this.prepValue(rec.value1) + "' AND " + this.prepValue(rec.value2);
            }
            else if (record instanceof records_1.DWhere) {
                rec = record;
                sql += " " + rec.that;
                if (rec.equals != null)
                    sql += "=" + rec.equals;
            }
            firstIteration = false;
        } // end for
        return sql;
    } // parseWhere
    ////////////////////////////////////////
    // And
    parseAnd(sql) {
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record instanceof records_1.DAnd) {
                let rec = record;
                sql += " AND " + rec.col;
                sql += " = '" + this.prepValue(rec.equals) + "'";
                break;
            }
        }
        return sql;
    }
    ////////////////////////////////////////
    // Order
    parseOrderBy(sql) {
        for (let i = 0; i < this.records.length; i++) {
            let record = this.records[i];
            if (record instanceof records_1.DOrderBy) {
                let rec = record;
                sql += " ORDER BY " + rec.col;
                break;
            }
        }
        return sql;
    } // end parseOrderBy
    ////////////////////////////////////////
    // Limit
    parseLimit(sql) {
        for (let i = 0; i < this.records.length; i++) {
            const record = this.records[i];
            if (record instanceof records_1.DLimit) {
                const rec = record;
                sql += " LIMIT " + rec.fromValue;
                if (rec.toValue != null) {
                    sql += ", " + rec.toValue;
                }
                break;
            }
        }
        return sql;
    } // end parseLimit
}
exports.DynSQL = DynSQL;
