/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as request from "request";

export class HttpPostData {
	baseRequest: any; //request;
	baseOptions: any;

	constructor() {
		this.baseRequest = request.defaults({
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'User-Agent': 'TopZap',
			},
			'gzip': false,
			'json': true
		});


		let baseOptions = {
			'headers': {
				//			'Accept-Encoding': '*',
				//			'Accept': '*',
				'content-type': 'application/x-www-form-urlencoded',
				'User-Agent': 'TopZap',
			},
			'gzip': false
		};
	}
/*
	public postData(url: string, payload: any, parseJson: boolean = true): Promise<any> {

		let newRequest = request.defaults({
			uri: url,
			json: parseJson,
			payload
		});

		return new Promise((resolve, reject) => {
			return newRequest(this.baseOptions, (error: any, response: any, body: any) => {
					console.log("postData ::", body);

					if (!error && response.statusCode == 200) {
						resolve(body);
					}
					else {
						reject(error);
					}
				}
			);
		});
	}
*/

	public postData(url: string, payload: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.baseRequest.post(url, payload, function optionalCallback(err, httpResponse, jsonData) {
				if (err) {
					reject(err);
				} else {
					resolve(jsonData)
				}
			});
		});
	}

}