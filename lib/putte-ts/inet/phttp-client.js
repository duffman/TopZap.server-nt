"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const http = require("http");
const https = require("https");
const request = require('request');
const log = console.log;
var UrlType;
(function (UrlType) {
    UrlType[UrlType["Unknown"] = 0] = "Unknown";
    UrlType[UrlType["Http"] = 1] = "Http";
    UrlType[UrlType["Https"] = 2] = "Https";
})(UrlType = exports.UrlType || (exports.UrlType = {}));
class InetUtils {
    static getHttps(url) {
        return new Promise((resolve, reject) => {
            https.get(url, res => {
                let source = "";
                res.setEncoding("utf8");
                res.on("data", buffer => {
                    source += buffer.toString();
                });
                res.on("end", () => {
                    resolve(source);
                });
            }).on('error', (e) => {
                reject(e);
            });
        });
    }
    static getHttp(url) {
        return new Promise((resolve, reject) => {
            http.get(url, res => {
                let source = "";
                res.setEncoding("utf8");
                res.on("data", buffer => {
                    source += buffer.toString();
                });
                res.on("end", () => {
                    resolve(source);
                });
            }).on('error', (e) => {
                reject(e);
            });
        });
    }
    /**
     * Returns the HTTP protocol type from a given URL
     * @param {string} url
     * @returns {UrlType}
     */
    static getUrlType(url) {
        let result = UrlType.Unknown;
        url = url.toLowerCase();
        let pUrl = url.substr(0, url.indexOf("://"));
        switch (pUrl) {
            case "http":
                result = UrlType.Http;
                break;
            case "https":
                result = UrlType.Https;
                break;
        }
        return result;
    }
    /**
     * Returns a string representation of a given PUrlType
     * @param {UrlType} urlType
     * @returns {string}
     */
    static urlTypeToString(urlType) {
        let result = "Unknown";
        switch (urlType) {
            case UrlType.Http:
                result = "PUrlType.Http";
                break;
            case UrlType.Https:
                result = "PUrlType.Https";
                break;
        }
        return result;
    }
    /**
     * Retrieves the source of a given URL, it will detect
     * Url type to seamlessly support both HTTP & HTTPS
     * @param string - url to extract source from
     * @returns Promise<string> - the source returned
     */
    static getUrlContents(url) {
        let scope = this;
        let urlType = InetUtils.getUrlType(url);
        let contents;
        return new Promise((resolve, reject) => {
            let urlTypeStr = InetUtils.urlTypeToString(urlType);
            if (urlType == UrlType.Http) {
                InetUtils.getHttp(url).then((contents) => {
                    resolve(contents);
                }).catch((err) => {
                    logger_1.Logger.logError("getUrlContents (HTTP) : " + err.code, url);
                    reject(err);
                });
            }
            else if (urlType == UrlType.Https) {
                InetUtils.getHttps(url).then((contents) => {
                    resolve(contents);
                }).catch((err) => {
                    logger_1.Logger.logError("getUrlContents (HTTPS) : " + err.code, url);
                    reject(err);
                });
            }
            else {
                let error = new Error("Unknown protocol");
                reject(error);
            }
        });
    }
    static conntionRefused(err) {
        return (err != null && err.code == "ECONNREFUSED");
    }
}
exports.InetUtils = InetUtils;
