/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone from 'Scaledrone';

let drone = new Scaledrone("90sdopk");



drone.on('on', () => {
	console.log("balle");
});

drone.close();

