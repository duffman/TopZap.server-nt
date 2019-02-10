
// Create Test Session Basket

import {DbManager} from '@putteDb/db-kernel';
import {Settings} from '@app/zappy.app.settings';


const log = console.log;


export class SessBasketTest {
	db: DbManager;

	constructor() {
		console.log("SessBasketTest", "constructor");

		this.db = new DbManager(Settings.Database.dbHost,
			Settings.Database.dbUser,
			Settings.Database.dbPass,
			Settings.Database.dbName);

	}

	public doRun() {
		let conn = this.db.createConnection();
		let sql = "SELECT * FROM product_edition LIMIT 1";

		conn.query(sql, (error, result, tableFields) => {

			if (error)  {
				console.log("ERROR ::", error);
				if (error.fatal) {
					console.trace('fatal error: ' + error.message);
				}

			} else {
				console.log("result", result);
			}
		});

	}

}


function execute() {
	let app = new SessBasketTest();
	app.doRun();
}

execute();





/*
db.dbQuery("SELECT * FROM session").then(res => {
	log("Rows ::", res.result);

}).catch(err => {
	log("ERROR :: ", err);
});
*/





