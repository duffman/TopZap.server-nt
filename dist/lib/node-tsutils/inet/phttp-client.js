"use strict";
/*=--------------------------------------------------------------=

 PutteTSNode - Yet Another Typescript Utilities Collection

 Author : Patrik Forsberg
 Email  : patrik.forsberg@coldmind.com
 GitHub : https://github.com/duffman
 Date   : 2018-11-01

 Use this software free of charge, the only thing I ask is that
 you obey to the terms stated in the license, i would also like
 you to keep the file header intact.

 This software is subject to the LGPL v2 License, please find
 the full license attached in LICENCE.md

 =----------------------------------------------------------------= */
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const cli_color_log_1 = require("../cli/cli-color-log");
const purl_type_1 = require("./purl-type");
//const http = require("http");
//const https = require("https");
//const request = require('request');
class PHttpClient {
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
     * @returns {PUrlType}
     */
    static getUrlType(url) {
        let result = purl_type_1.PUrlType.Unknown;
        url = url.toLowerCase();
        let pUrl = url.substr(0, url.indexOf("://"));
        switch (pUrl) {
            case "http":
                result = purl_type_1.PUrlType.Http;
                break;
            case "https":
                result = purl_type_1.PUrlType.Https;
                break;
        }
        return result;
    }
    /**
     * Returns a string representation of a given PUrlType
     * @param {PUrlType} urlType
     * @returns {string}
     */
    static urlTypeToString(urlType) {
        let result = "Unknown";
        switch (urlType) {
            case purl_type_1.PUrlType.Http:
                result = "PUrlType.Http";
                break;
            case purl_type_1.PUrlType.Https:
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
        let urlType = PHttpClient.getUrlType(url);
        let contents;
        return new Promise((resolve, reject) => {
            let urlTypeStr = PHttpClient.urlTypeToString(urlType);
            if (urlType == purl_type_1.PUrlType.Http) {
                PHttpClient.getHttp(url).then((contents) => {
                    resolve(contents);
                }).catch((err) => {
                    this.logError("getUrlContents (HTTP) : " + err.code, url);
                    reject(err);
                });
            }
            else if (urlType == purl_type_1.PUrlType.Https) {
                PHttpClient.getHttps(url).then((contents) => {
                    resolve(contents);
                }).catch((err) => {
                    this.logError("getUrlContents (HTTPS) : " + err.code, url);
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
    static logError(logMessage, logData = null) {
        cli_color_log_1.CliColorLog.LogBrightRed(logMessage, logData);
    }
}
exports.PHttpClient = PHttpClient;
