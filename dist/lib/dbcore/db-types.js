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
var FieldDataTypeDef;
(function (FieldDataTypeDef) {
    FieldDataTypeDef.BIGINT = 8;
    FieldDataTypeDef.TINYINT = 1;
    FieldDataTypeDef.SMALLINT = 2;
    FieldDataTypeDef.VARCHAR = 253;
    FieldDataTypeDef.INT = 3;
    FieldDataTypeDef.DATE_TIME = 12;
    FieldDataTypeDef.DOUBLE = 5;
    FieldDataTypeDef.POINT = 255;
    FieldDataTypeDef.ENUM_STR = 254;
})(FieldDataTypeDef = exports.FieldDataTypeDef || (exports.FieldDataTypeDef = {}));
var MySQLPacketDataTypes;
(function (MySQLPacketDataTypes) {
    MySQLPacketDataTypes[MySQLPacketDataTypes["bigint"] = 8] = "bigint";
    MySQLPacketDataTypes[MySQLPacketDataTypes["tinyint"] = 1] = "tinyint";
    MySQLPacketDataTypes[MySQLPacketDataTypes["smallint"] = 2] = "smallint";
    MySQLPacketDataTypes[MySQLPacketDataTypes["varchar"] = 253] = "varchar";
    MySQLPacketDataTypes[MySQLPacketDataTypes["int"] = 3] = "int";
    MySQLPacketDataTypes[MySQLPacketDataTypes["datetime"] = 12] = "datetime";
    MySQLPacketDataTypes[MySQLPacketDataTypes["double"] = 5] = "double";
    MySQLPacketDataTypes[MySQLPacketDataTypes["point"] = 255] = "point";
    MySQLPacketDataTypes[MySQLPacketDataTypes["enumStr"] = 254] = "enumStr";
})(MySQLPacketDataTypes = exports.MySQLPacketDataTypes || (exports.MySQLPacketDataTypes = {}));
