/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

export interface IDroneService {
	type: string;
	name: string;
	host: string;
}

export class DroneService implements IDroneService {
	constructor(public type: string,
				public name: string,
				public host: string) {}

}
