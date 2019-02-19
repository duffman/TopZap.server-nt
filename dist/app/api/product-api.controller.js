"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const product_db_1 = require("@db/product-db");
const cli_logger_1 = require("@cli/cli.logger");
const zap_error_result_1 = require("@zapModels/zap-error-result");
const product_data_result_1 = require("@zapModels/product-data-result");
const products_controller_1 = require("@app/components/product/products.controller");
class ProductApiController {
    constructor(debugMode = false) {
        this.debugMode = debugMode;
        this.controller = new products_controller_1.ProductsController();
        this.productDb = new product_db_1.ProductDb();
    }
    getProduct(barcode) {
        return new Promise((resolve, reject) => {
            this.productDb.getGameData(barcode).then((res) => {
                resolve(res);
            }).catch((err) => {
                cli_logger_1.Logger.logError("ProductApiController :: getGameData :: error ::", err);
                reject(err);
            });
        });
    }
    initRoutes(routes) {
        let scope = this;
        //
        // Get product info
        //
        routes.post("/prod", (req, resp) => {
            let code = req.body.code;
            console.log("CODE :: ", code);
            let productResult = new product_data_result_1.ProductDataResult();
            scope.getProduct(code).then((productData) => {
                productResult.success = true;
                productResult.productData = productData;
                resp.json(productResult);
            }).catch((err) => {
                cli_logger_1.Logger.logError("ProductApiController :: error ::", err);
                let zapError = new zap_error_result_1.ZapErrorResult(6667, "error-getting-item");
                productResult.success = false;
                productResult.error = zapError;
                resp.json(productResult);
            });
        });
        routes.get("/prod/:code", (req, resp) => {
            let code = req.params.code;
            scope.getProduct(code).then((prodResult) => {
                cli_logger_1.Logger.logDebug("ProductApiController :: getGameData ::", prodResult);
                resp.json(prodResult);
            }).catch((err) => {
                cli_logger_1.Logger.logError("ProductApiController :: error ::", err);
                resp.json({
                    result: "fail",
                    errorCode: 6667
                });
            });
        });
    }
}
exports.ProductApiController = ProductApiController;
