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
class DataSheet {
    constructor() {
        this.fieldTypes = {};
        this.fieldCount = 0;
    }
    parseFields(fields) {
        this.fieldCount = 0;
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
            this.fieldCount++;
        }
        console.log("FIELD COUNT:", fields.length);
    }
    /**
     * Returns the field type for a given field name
     * @param fieldName
     * @returns {number}
     */
    getFieldType(fieldName) {
        let result = -1;
        for (let name in this.fieldTypes) {
            if (name == fieldName) {
                result = this.fieldTypes[name];
                break;
            }
        }
        return result;
    }
}
exports.DataSheet = DataSheet;
