"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const basket_item_model_1 = require("@zapModels/basket/basket-item.model");
const vendor_basket_model_1 = require("@zapModels/basket/vendor-basket.model");
const session_basket_1 = require("@zapModels/session-basket");
const prand_num_1 = require("@putte/prand-num");
const product_db_1 = require("@db/product-db");
const barcode_parser_1 = require("@zaplib/../../lib/utils/barcode-parser");
const cli_logger_1 = require("@cli/cli.logger");
const basket_session_service_1 = require("@app/services/basket-session.service");
class BasketService {
    constructor() {
        this.basketSessService = new basket_session_service_1.BasketSessionService();
    }
    getSessionBasket(sessId) {
        return new Promise((resolve, reject) => {
            this.basketSessService.getSessionBasket(sessId).then(basket => {
                resolve(basket);
            }).catch(err => {
                cli_logger_1.Logger.logError("getSessionBasket ::", err);
                reject(err);
            });
        });
    }
    ensureBasket(sessionBasket) {
        if (!sessionBasket) {
            sessionBasket = new session_basket_1.SessionBasket();
            console.log("ensureBasket >> We´re creating the basket ::", sessionBasket.vendorBaskets);
        }
        return sessionBasket;
    }
    /**
     * Add new Vendor bid to session basket
     * @param {string} sessId
     * @param {IVendorOfferData} offerData
     * @returns {Promise<boolean>}
     */
    addToBasket(sessId, offerData) {
        return new Promise((resolve, reject) => {
            this.getSessionBasket(sessId).then(sessionBasket => {
                if (!offerData.accepted) {
                    console.log("NOT ACCEPTED");
                    return false;
                }
                let vendorOffer = parseFloat(offerData.offer);
                let resultItem = new basket_item_model_1.BasketItem(prand_num_1.PRandNum.randomNum(), 1, offerData.code, offerData.vendorId, offerData.title, vendorOffer);
                let result = this.addToVendorBasket(sessionBasket, resultItem);
                this.basketSessService.saveSessionBasket(sessId, sessionBasket);
                resolve(result);
            }).catch(err => {
                cli_logger_1.Logger.logError("addToBasket ::", err);
                reject();
            });
        });
    }
    /**
     * Retrieve a specific vendor basket from the session basket
     * @param {ISessionBasket} sessBasket
     * @param {number} vendorId
     * @returns {IBasketModel}
     */
    getVendorBasket(sessBasket, vendorId) {
        let result = null;
        console.log("Get getVendorBasket ##### sessBasket.data", sessBasket.vendorBaskets);
        if (!sessBasket.vendorBaskets) {
            console.log("sessBasket.vendorBaskets :: was unassigned");
            sessBasket.vendorBaskets = new Array(); //VendorBasketModel(vendorId);
        }
        for (let i = 0; i < sessBasket.vendorBaskets.length; i++) {
            let basket = sessBasket.vendorBaskets[i];
            if (basket.vendorId === vendorId) {
                result = basket;
                break;
            }
        }
        if (result === null) {
            result = new vendor_basket_model_1.VendorBasketModel(vendorId);
            sessBasket.vendorBaskets.push(result);
        }
        return result;
    }
    addToVendorBasket(sessBasket, item) {
        let basket = this.getVendorBasket(sessBasket, item.vendorId);
        let existingItem = basket.items.find(o => o.code === item.code);
        // Here we increase the count if an item already exist
        if (typeof existingItem === "object") {
            existingItem.count++;
        }
        else {
            basket.items.push(item);
        }
        return true;
    }
    getBasketTotal(basket) {
        let total = 0;
        if (basket.items === null)
            return 0;
        for (let index in basket.items) {
            let item = basket.items[index];
            total = total + item.offer;
        }
        return total;
    }
    /**
     * Get the basket with the higest value and attach product data
     * @param {string} sessId
     * @returns {Promise<IBasketModel>}
     */
    getCurrentBasket(sessId) {
        console.log("getCurrentBasket -->");
        let scope = this;
        let result = null;
        let error = null;
        async function getBasket() {
            try {
                let sessionBasket = await scope.getReviewData(sessId);
                let baskets = sessionBasket.vendorBaskets;
                console.log("getBasket() :: sessionBasket ::", sessionBasket);
                // Remove all baskets except the first (highest value)
                if (baskets && baskets.length > 0) {
                    let bestBasket = baskets[0];
                    bestBasket.vendorData = null;
                    baskets = [bestBasket];
                }
                result = sessionBasket;
            }
            catch (ex) {
                error = ex;
            }
        }
        return new Promise((resolve, reject) => {
            getBasket().then(() => {
                if (error !== null) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            }).catch(err => {
                cli_logger_1.Logger.logError("getCurrentBasket :: err ::", err);
            });
        });
    }
    /**
     * Returns the vendor basket with the highest value
     * @param {ISessionBasket} sessionBasket
     * @returns {IBasketModel}
     */
    getBestBasket(sessionBasket) {
        let vendorBaskets = sessionBasket.vendorBaskets;
        let bestTotal = 0;
        let bestBaset = null;
        console.log("getBestBasket ::", bestBaset);
        for (let index in vendorBaskets) {
            let basket = vendorBaskets[index];
            let total = this.getBasketTotal(basket);
            if (total > bestTotal) {
                bestTotal = total;
                bestBaset = basket;
            }
        }
        return bestBaset;
    }
    /**
     * TODO: IMPLEMENT REAL FUNCTIONALITY
     * @param {ISessionBasket} sessionBasket
     * @returns {Promise<ISessionBasket>}
     */
    extendSessionBasket(sessionBasket) {
        let prodDb = new product_db_1.ProductDb();
        return new Promise((resolve, reject) => {
            prodDb.getProducts(['0819338020068', '0887195000424']).then(res => {
            }).catch(err => {
                console.log("extendSessionBasket :: err ::", err);
            });
        });
    }
    /**
     * Extract all barcodes from the session basket
     * @param {ISessionBasket} sessionBasket
     * @returns {string[]}
     */
    getBasketCodes(sessionBasket) {
        let result = new Array();
        if (!sessionBasket) {
            return result;
        }
        function addBarcode(code) {
            code = barcode_parser_1.BarcodeParser.prepEan13Code(code);
            if (result.indexOf(code) === -1) {
                result.push(code);
            }
        }
        for (const vendorBasket of sessionBasket.vendorBaskets) {
            for (const item of vendorBasket.items) {
                addBarcode(item.code);
            }
        }
        return result;
    }
    /**
     * Returns all Vendor baskets
     * @param {string} sessId
     * @returns {Promise<ISessionBasket>}
     */
    getFullBasket(sessId) {
        return new Promise((resolve, reject) => {
            return this.basketSessService.getSessionBasket(sessId).then(sessionBasket => {
                resolve(sessionBasket);
            }).catch(err => {
                cli_logger_1.Logger.logError("getFullBasket ::", err);
                reject(err);
            });
        });
    }
    /**
     * Order baskets by total value
     * @param {ISessionBasket} sessionBasket
     * @returns {ISessionBasket}
     */
    sortSessionBasket(sessionBasket) {
        this.ensureBasket(sessionBasket);
        for (const basket of sessionBasket.vendorBaskets) {
            basket.totalValue = this.getBasketTotal(basket);
        }
        sessionBasket.vendorBaskets = sessionBasket.vendorBaskets.sort((x, y) => {
            if (x.totalValue > y.totalValue) {
                return -1;
            }
            if (x.totalValue < y.totalValue) {
                return 1;
            }
            return 0;
        });
        return sessionBasket;
    }
    /**
     * Attach Vendor Data
     * Attaches vendor info to basket items
     * @param {ISessionBasket} sessBasket
     * @param {IVendorModel[]} vendors
     */
    attachVendors(sessBasket, vendors) {
        function getVendorDataById(vendorId) {
            let result = null;
            for (let vendorData of vendors) {
                if (vendorData.id === vendorId) {
                    result = vendorData;
                    break;
                }
            }
            return result;
        }
        for (let vendorBasket of sessBasket.vendorBaskets) {
            let vendorData = getVendorDataById(vendorBasket.vendorId);
            vendorBasket.vendorData = vendorData;
        }
    }
    /**
     * Calculate total value of each basket
     * @param {ISessionBasket} sessBasket
     */
    calcBasketTotals(sessBasket) {
        if (!sessBasket.vendorBaskets) {
            cli_logger_1.Logger.logError("calcBasketTotals :: no vendorBaskets");
            return;
        }
        for (let vendorBasket of sessBasket.vendorBaskets) {
            vendorBasket.totalValue = this.getBasketTotal(vendorBasket);
        }
    }
    /**
     * Get all baskets for all vendors including product data
     * @param {string} sessId
     * @returns {Promise<ISessionBasket>}
     */
    getReviewData(sessId) {
        let scope = this;
        let sessBasket;
        let prodDb = new product_db_1.ProductDb();
        function getProducts() {
            return new Promise((resolve, reject) => {
                let codes = scope.getBasketCodes(sessBasket);
                return prodDb.getProducts(codes).then(res => {
                    resolve(res);
                }).catch(err => {
                    cli_logger_1.Logger.logError("getExtSessionBasket :: err ::", err);
                    reject(err);
                });
            });
        }
        function getVendors() {
            return new Promise((resolve, reject) => {
                return prodDb.getVendors().then(res => {
                    resolve(res);
                }).catch(err => {
                    cli_logger_1.Logger.logError("getExtSessionBasket :: err ::", err);
                });
            });
        }
        function getProdData(code, prodData) {
            console.log("getProdData >>>>>");
            let res = null;
            for (let prod of prodData) {
                if (prod.code === code) {
                    res = prod;
                    break;
                }
            }
            return res;
        }
        function attachProductInfoToItem(sessBasket) {
            console.log("attachProductInfoToItem >>>>>");
            scope.ensureBasket(sessBasket);
            for (let vb of sessBasket.vendorBaskets) {
                for (let item of vb.items) {
                    let prodData = getProdData(item.code, sessBasket.productData);
                    item.thumbImage = prodData.thumbImage;
                    item.platformIcon = prodData.platformIcon;
                    item.releaseDate = prodData.releaseDate;
                }
            }
        }
        async function getSessionBasket() {
            try {
                sessBasket = await scope.getFullBasket(sessId);
                if (!sessBasket.vendorBaskets) {
                    console.log("Creating Vendor Array!");
                    sessBasket.vendorBaskets = new Array();
                }
                let prodData = await getProducts();
                sessBasket.productData = prodData;
                let vendors = await getVendors();
                console.log("getSessionBasket ::", prodData);
                // Sort the basket according to highest basket value
                sessBasket = scope.sortSessionBasket(sessBasket);
                // HACK TO ATTACH PROD DATA TO IBasketItem decendant IGameBasketItem
                attachProductInfoToItem(sessBasket);
                //Hack
                for (let vbasket of sessBasket.vendorBaskets) {
                    vbasket.highestBidder = false;
                }
                // Set Highest Bidder Property to the first vendor...
                if (sessBasket.vendorBaskets.length > 0) {
                    sessBasket.vendorBaskets[0].highestBidder = true;
                }
                // Duffman: 2019-01-05 Breaking Change, attach vendor data to each
                // basket instead of attached directly to the root of the basket
                // sessBasket.vendorData = vendors;
                scope.attachVendors(sessBasket, vendors);
                scope.calcBasketTotals(sessBasket);
            }
            catch (err) {
                console.log("2 --- getExtSessionBasket :: getSessionBasket ::", err);
            }
        }
        return new Promise((resolve, reject) => {
            getSessionBasket().then(() => {
                resolve(sessBasket);
            }).catch(err => {
                cli_logger_1.Logger.logFatalError("getExtSessionBasket");
                reject(err);
            });
        });
    }
    showBasket(sessId) {
        this.getFullBasket(sessId).then(sessionBasket => {
            for (const vendorData of sessionBasket.vendorBaskets) {
                console.log("BASKET :: VENDOR ::", vendorData.vendorId);
                for (const item of vendorData.items) {
                    console.log("  ITEM ::", item);
                }
            }
        }).catch(err => {
            cli_logger_1.Logger.logError("showBasket ::", err);
        });
    }
    /**
     * Remove product assicoated with a barcode from a session basket
     * @param {string} sessId
     * @param {string} code
     * @returns {boolean}
     */
    removeProductData(code, basket = null) {
        let result = false;
        basket.productData = !(basket.productData) ? new Array() : basket.productData;
        for (let i = 0; i < basket.productData.length; i++) {
            let product = basket.productData[i];
            if (product.code === code) {
                basket.productData.splice(i, 1);
                result = true;
                break;
            }
        }
        return result;
    }
    /**
     * Remove item by barcode from all vendor baskets
     * @param {string} sessId
     * @param {string} code
     * @param {ISessionBasket} basket
     */
    removeItemByCode(code, basket = null) {
        let result = false;
        this.removeProductData(code, basket);
        console.log("removeItemByCode :: removeProductData ::", basket);
        for (const vendorData of basket.vendorBaskets) {
            console.log("VENDOR BASKET ::", vendorData);
            for (let i = 0; i < vendorData.items.length; i++) {
                let item = vendorData.items[i];
                if (item.code === code) {
                    vendorData.items.splice(i, 1);
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
    removeItem(code) {
        let scope = this;
        return new Promise((resolve, reject) => {
            scope.removeItem(code).then(res => {
            }).catch(err => {
            });
        });
    }
}
exports.BasketService = BasketService;
