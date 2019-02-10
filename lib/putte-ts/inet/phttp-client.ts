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

import * as http                  from "http";
import * as https                 from "https";
import * as request               from "request";
import { CliColorLog }            from "../cli/cli-color-log";
import { PUrlType }               from "./purl-type";

//const http = require("http");
//const https = require("https");
//const request = require('request');

export class PHttpClient {
	public static getHttps(url: string): Promise<string> {
		return new Promise( (resolve, reject) => {
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

	public static getHttp(url: string): Promise<string> {
		return new Promise( (resolve, reject) => {
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
	public static getUrlType(url: string): PUrlType {
		let result = PUrlType.Unknown;
		url = url.toLowerCase();

		let pUrl = url.substr(0, url.indexOf("://"));

		switch (pUrl) {
			case "http":
				result = PUrlType.Http;
				break;

			case "https":
				result = PUrlType.Https;
				break;
		}

		return result;
	}

	/**
	 * Returns a string representation of a given PUrlType
	 * @param {PUrlType} urlType
	 * @returns {string}
	 */
	public static urlTypeToString(urlType: PUrlType): string {
		let result = "Unknown";
		switch (urlType) {
			case PUrlType.Http:
				result = "PUrlType.Http";
				break;

			case PUrlType.Https:
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
	public static getUrlContents(url: string): Promise<string> {
		let scope = this;
		let urlType = PHttpClient.getUrlType(url);
		let contents: string;

		return new Promise((resolve, reject) => {
			let urlTypeStr = PHttpClient.urlTypeToString(urlType);

			if (urlType == PUrlType.Http) {
				PHttpClient.getHttp(url).then((contents) => {
					resolve(contents);
				}).catch((err) => {
					this.logError("getUrlContents (HTTP) : " + err.code, url);
					reject(err);
				});

			} else if (urlType == PUrlType.Https) {
				PHttpClient.getHttps(url).then((contents) => {
					resolve(contents);
				}).catch((err) => {
					this.logError("getUrlContents (HTTPS) : " + err.code, url);
					reject(err);
				});

			} else {
				let error = new Error("Unknown protocol");
				reject(error);
			}
		});
	}

	public static conntionRefused(err: any): boolean {
		return (err != null && err.code == "ECONNREFUSED");
	}

	public static logError(logMessage: string, logData: any = null) {
		CliColorLog.LogBrightRed(logMessage, logData);
	}
}
