/**
 * Patrik Forsberg ("CREATOR") CONFIDENTIAL
 * Unpublished Copyright (c) 2015-2018 Patrik Forsberg, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of CREATOR. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current CREATOR employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  CREATOR.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF CREATOR IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 */

import {DbManager} from "@putteDb/db-kernel";
import {MinerDb} from "@miner/miner-db";

export class DbTest {
	minerDb: MinerDb;

	constructor() {
		this.minerDb = new MinerDb();
	}

	public execute() {
		let scope = this;
		let db = new DbManager();


		scope.minerDb.checkOutWorkQueue(29, 10).then((res) => {
			console.log("RES ::", res);

		}).catch((err) => {
			console.log("CATCH ::", err);
		});

		/*
		scope.minerDb.getWorkQueue(29, 10).then((res) => {
			let idList = new Array<string>();

			for (let i = 0; i < res.length; i++) {
				let item = res[i];
				let entry = `id=${item.id}`;
				idList.push(entry);
			}

			let sqlString = "UPDATE price_miner_queue SET checkout_time=NOW() WHERE " + idList.join(" OR ");
			console.log(sqlString);
		});
		*/

		/*
		database.runInTransaction("SELECT * FROM price_miner_queue").then((res) => {
			console.log("RES", res);
		});
		*/
	}
}


let app = new DbTest();
app.execute();