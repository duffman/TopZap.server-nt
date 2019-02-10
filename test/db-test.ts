/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {DbKernel} from '@putteDb/db-kernel-new';

let dbKernel = new DbKernel();
dbKernel.dbQuery("SELECT * FROM product_edition LIMIT 10").then(res => {
	console.log("RES ::", res);
}).catch(err => {
	console.log("ERR ::", err);
});