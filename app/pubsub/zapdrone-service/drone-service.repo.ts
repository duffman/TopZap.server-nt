/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { injectable } from "inversify";

export interface IDroneServiceRepo {
}

@injectable()
export class DroneServiceRepo implements IDroneServiceRepo {
	constructor() {

	}

	public getServiceOfType() {}

	private init() {
		let pingTimer = setInterval(() => {
			client.get('string key', function (err, reply) {
				if(reply) {
					console.log('I live: ' + reply.toString());
				} else {
					clearTimeout(myTimer);
					console.log('I expired');
					client.quit();
				}
			});
		}, 1000);
	}
}
