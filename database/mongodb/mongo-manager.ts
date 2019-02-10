/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IMongoDbController }     from "@mongo/mongo-db-controller";
import { MongoClient }            from 'mongodb';

export class MongoManager implements IMongoDbController {
	constructor() {

/*
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			console.log("Database created!");
			db.close();
		});
*/
	}
}
