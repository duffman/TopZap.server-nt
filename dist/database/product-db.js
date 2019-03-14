"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const db_kernel_1 = require("@putteDb/db-kernel");
const cli_logger_1 = require("@cli/cli.logger");
const vendor_model_1 = require("@zapModels/vendor-model");
const platform_type_parser_1 = require("@utils/platform-type-parser");
const pstr_utils_1 = require("@putte/pstr-utils");
const cli_commander_1 = require("@cli/cli.commander");
const product_model_1 = require("@zapModels/product.model");
const game_product_model_1 = require("@zapModels/game-product-model");
let ProductDb = class ProductDb {
    constructor() {
        this.db = new db_kernel_1.DBKernel();
        this.init();
    }
    init() { }
    /**
     * Get Game Product Data
     * @param barcode
     * @param extended
     * @param debug
     * @returns {Promise<T>}
     */
    getGameData(barcode, extended = true, debug = false) {
        function generateSql() {
            if (!debug) {
                return `SELECT games.* FROM games, product_edition AS edition WHERE edition.barcode='${barcode}' AND games.id = edition.game_id`;
            }
            else {
                return `SELECT games.* FROM games, product_edition AS edition WHERE games.id = edition.game_id ORDER BY RAND() LIMIT 1`;
            }
        }
        let sql = generateSql();
        cli_logger_1.Logger.logGreen("SQL ::", sql);
        function createGameProductModel(dbRow) {
            if (dbRow.isEmpty) {
                return new product_model_1.ProductData();
            }
            else {
                return new game_product_model_1.GameProductData(dbRow.getValAsInt("id"), barcode, dbRow.getValAsStr("platform_name"), dbRow.getValAsStr("title"), dbRow.getValAsStr("publisher"), dbRow.getValAsStr("developer"), dbRow.getValAsStr("genre"), dbRow.getValAsStr("cover_image"), dbRow.getValAsStr("thumb_image"), dbRow.getValAsStr("video_source"), dbRow.getValAsStr("source"), dbRow.getValAsStr("release_date"));
            }
        }
        return new Promise((resolve, reject) => {
            return this.db.dbQuery(sql).then((dbRes) => {
                let dbRow = dbRes.safeGetFirstRow();
                let model = createGameProductModel(dbRow);
                let havePlatformAndTitle = !pstr_utils_1.PStrUtils.isEmpty(model.platformName) && !pstr_utils_1.PStrUtils.isEmpty(model.title);
                //
                // Add extended properties
                //
                if (extended && !dbRow.isEmpty && havePlatformAndTitle) {
                    cli_logger_1.Logger.logYellow("Adding extended properties to:", model.title);
                    let gpp = new platform_type_parser_1.PlatformTypeParser();
                    model.platformIcon = gpp.parseFromName(model.platformName, true);
                    model.platformImage = gpp.parseFromName(model.platformName, false);
                    cli_logger_1.Logger.logCyan("getGameData() :: Model", model);
                }
                resolve(model);
            }).catch((error) => {
                cli_logger_1.Logger.logError("getGameData() :: error ::", error);
                reject(error);
            });
        });
    }
    /**
     * Get product data for a given list of barcodes
     * @param codes
     * @returns {Promise<T>}
     */
    getProducts(codes) {
        let scope = this;
        let result = new Array();
        function getProductPromise(code) {
            return new Promise((resolve, reject) => {
                scope.getGameData(code).then(res => {
                    result.push(res);
                    resolve(res);
                }).catch(err => {
                    console.log("getProducts :: Error getting product ::", err);
                    reject(err);
                });
            });
        }
        return new Promise((resolve, reject) => {
            let promises = Array();
            for (const code of codes) {
                promises.push(getProductPromise(code));
            }
            Promise.all(promises).catch((err) => {
                console.log("getProducts :: err ::", err);
                reject(err);
            }).then(() => {
                cli_logger_1.Logger.logYellow("Promises Done");
                resolve(result);
            });
        });
    }
    /**
     * Returns all product vendors
     * @returns {Promise<T>}
     */
    getVendors() {
        let result = new Array();
        let sql = `SELECT * FROM product_vendors`;
        return new Promise((resolve, reject) => {
            return this.db.dbQuery(sql).then((dbRes) => {
                for (let i = 0; i < dbRes.result.rowCount(); i++) {
                    let dbRow = dbRes.result.dataRows[i];
                    let model = new vendor_model_1.Vendor(dbRow.getValAsNum("id"), dbRow.getValAsStr("identifier"), dbRow.getValAsStr("vendor_type"), dbRow.getValAsStr("name"), dbRow.getValAsStr("description"), dbRow.getValAsStr("website_url"), dbRow.getValAsStr("logo_name"), dbRow.getValAsStr("color"), dbRow.getValAsStr("textColor"), dbRow.getValAsStr("colorHighlight"));
                    result.push(model);
                }
                resolve(result);
            }).catch((error) => {
                cli_logger_1.Logger.logError("Error Gettings Vendors", error);
                reject(error);
            });
        });
    }
};
ProductDb = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], ProductDb);
exports.ProductDb = ProductDb;
if (cli_commander_1.CliCommander.haveArgs() && cli_commander_1.CliCommander.first("product-db")) {
    console.log("OUTSIDE CODE EXECUTING");
    console.log("DEBUG!");
    let debug = new ProductDb();
    debug.getGameData("0819338020068").then((res) => {
        console.log("ProductDb ::", res);
    }).catch((err) => {
        console.log("ProductDb :: err", err);
    });
}
else {
    console.log("NO DEBUG!");
}
