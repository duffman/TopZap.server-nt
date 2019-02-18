"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
const basket_item_model_1 = require("@zapModels/basket/basket-item.model");
const prand_num_1 = require("@putte/prand-num");
const product_db_1 = require("@db/product-db");
const barcode_parser_1 = require("@zaplib/barcode-parser");
const product_item_types_1 = require("@zapModels/product-item-types");
const cli_debug_yield_1 = require("@cli/cli.debug-yield");
const cli_logger_1 = require("@cli/cli.logger");
class BasketHandlerDb {
    constructor(sessManager) {
        this.sessManager = sessManager;
    }
    getSessionBasket(sessId) {
        return this.sessManager.getSessionBasket(sessId);
    }
    addToBasket(sessId, offerData) {
        return new Promise((resolve, reject) => {
            this.getSessionBasket(sessId).then(sessBasket => {
                if (!offerData.accepted) {
                    console.log("NOT ACCEPTED");
                    return false;
                }
                let vendorOffer = parseFloat(offerData.offer);
                let resultItem = new basket_item_model_1.BasketItem(prand_num_1.PRandNum.randomNum(), 1, offerData.code, offerData.vendorId, offerData.title, vendorOffer);
                return this.addToVendorBasket(sessId, resultItem);
            }).catch(err => {
                cli_logger_1.Logger.logAppError(this, "addToBasket", err);
                reject(err);
            });
        });
    }
    /**
     * Add a prepared BasketItem to the session
     * @param {string} sessId
     * @param {IBasketItem} item
     * @returns {Promise<boolean>}
     */
    addToVendorBasket(sessId, item) {
        //return this.getVendorBasket(sessId, item.vendorId).then(basket => {
        return new Promise((resolve, reject) => {
            return this.getSessionBasket(sessId).then(sessBasket => {
                for (let vendorBasket of sessBasket.vendorBaskets) {
                    let existingItem = vendorBasket.items.find(o => o.code === item.code);
                    if (typeof existingItem === "object") {
                        existingItem.count++;
                    }
                    else {
                        vendorBasket.items.push(item);
                    }
                }
                return this.sessManager.setSessionBasket(sessId, sessBasket);
            });
        });
    }
    /**
     * Find vendor basket in given SessionBasket
     * @param {number} vendorId
     * @param {ISessionBasket} sessionBasket
     * @returns {IVendorBasket}
     */
    findVendorBasketInSession(vendorId, sessionBasket) {
        let result = null;
        for (let i = 0; i < sessionBasket.vendorBaskets.length; i++) {
            let basket = sessionBasket.vendorBaskets[i];
            if (basket.vendorId === vendorId) {
                result = basket;
                break;
            }
        }
        return result;
    }
    findItemByCodeInVendorBasket(code, vendorBasket) {
        let result = null;
        for (let i = 0; i < vendorBasket.items.length; i++) {
            let item = vendorBasket.items[i];
            if (item.code === code) {
                result = item;
                break;
            }
        }
        return result;
    }
    getVendorBasket(sessId, vendorId) {
        let result = null;
        return new Promise((resolve, reject) => {
            return this.getSessionBasket(sessId).then(sessBasket => {
                let basket = this.findVendorBasketInSession(vendorId, sessBasket);
                resolve(basket);
            }).catch(err => {
                cli_logger_1.Logger.logAppError(this, "getVendorBasket", err);
                reject(err);
            });
        });
    }
    getBasketTotal(basket) {
        let total = 0;
        for (let index in basket.items) {
            let item = basket.items[index];
            total = total + item.offer;
        }
        return total;
    }
    getBestBasket(sessId) {
        let bestTotal = 0;
        let bestBaset = null;
        return new Promise((resolve, reject) => {
            return this.getSessionBasket(sessId).then(sessBasket => {
                console.log("getBestBasket ::", bestBaset);
                for (let index in sessBasket.vendorBaskets) {
                    let basket = sessBasket.vendorBaskets[index];
                    let total = this.getBasketTotal(basket);
                    if (total > bestTotal) {
                        bestTotal = total;
                        bestBaset = basket;
                    }
                }
                resolve(bestBaset);
            }).catch(err => {
                cli_logger_1.Logger.logAppError(this, "getBestBasket", err);
                reject(err);
            });
        });
    }
    extendSessionBasket(data) {
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
    getFullBasket(sessId) {
        return new Promise((resolve, reject) => {
            return this.getSessionBasket(sessId).then(sessBasket => {
                console.log("getFullBasket :: sessBasket ::", sessBasket);
                resolve(sessBasket);
            }).catch(err => {
                cli_logger_1.Logger.logAppError(this, "getFullBasket", err);
                reject(err);
            });
        });
    }
    sortSessionBasket(sessionBasket) {
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
     * Attaches
     * @param {ISessionBasket} sessBasket
     * @param {IVendorModel[]} vendors
     */
    attachVendors(sessBasket, vendors) {
        console.log("attachVendors ::", sessBasket);
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
            console.log("attachVendors :: LOOPING :: vendorBasket ::", vendorBasket);
            let vendorData = getVendorDataById(vendorBasket.vendorId);
            vendorBasket.vendorData = vendorData;
        }
    }
    /**
     * Calculate total value of each basket
     * @param {ISessionBasket} sessBasket
     */
    calcBasketTotals(sessBasket) {
        for (let vendorBasket of sessBasket.vendorBaskets) {
            vendorBasket.totalValue = this.getBasketTotal(vendorBasket);
        }
    }
    generateZid() {
        let zid = prand_num_1.PRandNum.getRandomInt(10, 22000).toFixed(2);
        return zid;
    }
    /**
     * Get Session Basket with Vendor Data attached to each Vendor Basket
     * @param {string} sessId
     * @returns {Promise<ISessionBasket>}
     */
    getExtSessionBasket(sessId) {
        cli_logger_1.Logger.logGreen("****** getExtSessionBasket");
        let scope = this;
        let sessBasket = null;
        let prodDb = new product_db_1.ProductDb();
        function getFullBasket() {
            return new Promise((resolve, reject) => {
                return this.getFullBasket(sessId);
            });
        }
        function getProducts() {
            return new Promise((resolve, reject) => {
                let codes = scope.getBasketCodes(sessBasket);
                return prodDb.getProducts(codes).then(res => {
                    console.log("FETRES :::", res);
                    resolve(res);
                }).catch(err => {
                    console.log("getExtSessionBasket :: err ::", err);
                    reject(err);
                });
            });
        }
        function getVendors() {
            return new Promise((resolve, reject) => {
                return prodDb.getVendors().then(res => {
                    resolve(res);
                }).catch(err => {
                    console.log("getExtSessionBasket :: err ::", err);
                });
            });
        }
        /**
         * Retrieves productdata with a given barcode from given productdata array
         * @param {string} code
         * @param {IGameProductData[]} prodData
         * @returns {IGameProductData}
         */
        function getCoreProductData(code, prodData) {
            let res = null;
            for (let prod of prodData) {
                if (prod.code === code) {
                    res = prod;
                    break;
                }
            }
            return res;
        }
        /**
         * Retrieves gamedata with a given barcode from given gamedata array
         * @param {string} code
         * @param {IGameProductData[]} prodData
         * @returns {IGameProductData}
         */
        function getGameProductData(code, prodData) {
            let res = null;
            for (let prod of prodData) {
                if (prod.code === code) {
                    res = prod;
                    break;
                }
            }
            return res;
        }
        function getProductData(code, prodType, sessBasket) {
            let result;
            switch (prodType) {
                case product_item_types_1.ProductItemTypes.GAME: {
                    getGameProductData(code, sessBasket.productData);
                }
            }
            return result;
        }
        function attachProductInfoToItem(sessBasket) {
            cli_logger_1.Logger.logGreen("--------------------------------");
            cli_logger_1.Logger.logGreen("sessBasket ::", sessBasket);
            cli_logger_1.Logger.logGreen("--------------------------------");
            for (let vb of sessBasket.vendorBaskets) {
                for (let vbItem of vb.items) {
                    let gameBasketItem = vbItem;
                    //TODO: Find a more sane way of making the distinction between types
                    //let prodData: IGameProductData = getProductData(gameBasketItem.code,ProductItemTypes.GAME, sessBasket) as IGameProductData;
                    let prodData = getGameProductData(gameBasketItem.code, sessBasket.productData);
                    /* IProductData
                        public id:            number = -1,
                        public code:          string = '',
                        public platformName:  string = '',
                        public title:         string = '',
                        public publisher:     string = '',
                        public developer:     string = '',
                        public genre:         string = '',
                        public coverImage:    string = '',
                        public thumbImage:    string = '',
                        public videoSource:   string = '',
                        public source:        string = '',
                        public releaseDate:   string = '',
                        public platformIcon:  string = '',
                        public platformImage: string = '',
                     */
                    gameBasketItem.zid = scope.generateZid();
                    gameBasketItem.code = prodData.code;
                    gameBasketItem.id = prodData.id;
                    gameBasketItem.itemType = product_item_types_1.ProductItemTypes.GAME;
                    gameBasketItem.vendorId = vbItem.vendorId;
                    gameBasketItem.title = prodData.title;
                    gameBasketItem.offer = vbItem.offer;
                    gameBasketItem.thumbImage = prodData.thumbImage;
                    gameBasketItem.platformIcon = prodData.platformIcon;
                    gameBasketItem.count = vbItem.count;
                    gameBasketItem.platformName = prodData.platformName;
                    gameBasketItem.publisher = prodData.publisher;
                    gameBasketItem.releaseDate = prodData.releaseDate;
                }
            }
        }
        async function getSessionBasket() {
            try {
                sessBasket = await getFullBasket();
                let prodDb = new product_db_1.ProductDb();
                let codes = this.getBasketCodes(sessBasket);
                let prodData = await getProducts();
                sessBasket.productData = prodData;
                let vendors = await getVendors();
                console.log("getSessionBasket ::", prodData);
                // Sort the basket according to highest basket value
                sessBasket = scope.sortSessionBasket(sessBasket);
                console.log("getSessionBasket :: SORTED ::", sessBasket);
                // HACK TO ATTACH PROD DATA TO IBasketItem decendant IGameBasketItem
                attachProductInfoToItem(sessBasket);
                console.log("getSessionBasket :: ATTACHED ::", sessBasket);
                //Hack
                for (let vbasket of sessBasket.vendorBaskets) {
                    vbasket.highestBidder = false;
                }
                // Set Highest Bidder Property to the first vendor...
                if (sessBasket.vendorBaskets.length > 0) {
                    sessBasket.vendorBaskets[0].highestBidder = true;
                    console.log("HIGH BID SET ::", sessBasket.vendorBaskets[0]);
                }
                for (let b of sessBasket.vendorBaskets) {
                    console.log("BDATA ::", b);
                }
                // Duffman: 2019-01-05 Breaking Change, attach vendor vendorBaskets to each
                // basket instead of attached directly to the root of the basket
                // sessBasket.vendorData = vendors;
                scope.attachVendors(sessBasket, vendors);
                scope.calcBasketTotals(sessBasket);
            }
            catch (err) {
                let errMessage = "getExtSessionBasket :: ERROR ::";
                cli_logger_1.Logger.logError(errMessage, err);
                cli_debug_yield_1.CliDebugYield.fatalError(errMessage, err, true);
            }
        }
        return new Promise((resolve, reject) => {
            getSessionBasket().then(() => {
                resolve(sessBasket);
            });
        });
    }
    showBasket(sessId) {
        this.sessManager.getSessionBasket(sessId).then(basket => {
            for (const vendorData of basket.vendorBaskets) {
                //console.log("BASKET :: VENDOR ::", vendorData.vendorId);
                for (const item of vendorData.items) {
                    console.log("  ITEM ::", item.title + " " + item.offer);
                }
            }
        }).catch(err => {
            cli_logger_1.Logger.logAppError(this, "showBasket", err);
        });
    }
    /**
     * Remove product assicoated with a barcode from a session basket
     * @param {string} sessId
     * @param {string} code
     * @returns {boolean}
     */
    removeProductByCode(sessId, code, basket = null) {
        let result = false;
        async function excecute() {
            if (basket === null) {
                basket = await this.sessManager.getSessionBasket(sessId);
            }
            basket.productData = !(basket.productData) ? new Array() : basket.productData;
            for (let i = 0; i < basket.productData.length; i++) {
                let product = basket.productData[i];
                if (product.code === code) {
                    basket.productData.splice(i, 1);
                    result = true;
                    break;
                }
            }
        }
        return new Promise((resolve, reject) => {
            excecute().then(() => {
                resolve(result);
            });
        });
    }
    removeItemFromBasket(code, basket) {
        // TODO: snygga till detta bara för sakens skull.. detta var inte så jävla skitsnyggt
        let result = false;
        if (basket === null) {
            return result;
        }
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
    /**
     * Remove item by barcode from all vendor baskets
     * @param {string} sessId
     * @param {string} code
     * @param {ISessionBasket} basket
     */
    removeItemByCode(sessId, code, basket = null) {
        let result = false;
        console.log("removeItemByCode ::", basket);
        return new Promise((resolve, reject) => {
            if (basket === null) {
                return this.sessManager.getSessionBasket(sessId).then(sessBasket => {
                    this.removeItemFromBasket(code, sessBasket);
                    return this.sessManager.setSessionBasket(sessId, sessBasket).then(res => {
                        resolve(res);
                    }).catch(err => {
                        cli_logger_1.Logger.logAppError(this, "removeItemByCode", err);
                        reject(err);
                    });
                }).catch(err => {
                    cli_logger_1.Logger.logAppError(this, "getSessionBasket :: ERROR ::", err);
                    reject(err);
                });
            }
            else {
                this.removeItemFromBasket(code, basket);
                return this.sessManager.setSessionBasket(sessId, basket).then(res => {
                    resolve(res);
                }).catch(err => {
                    cli_logger_1.Logger.logAppError(this, "removeItemByCode", err);
                    reject(err);
                });
            }
        });
        /*
                if (basket === null) {
                basket = this.sessManager.getSessionBasket(sessId);
            }

            console.log("removeItemByCode ::", basket);
            this.removeProductData(sessId, code, basket);
            console.log("removeItemByCode :: removeProductData ::", basket);
            */
    }
}
exports.BasketHandlerDb = BasketHandlerDb;
