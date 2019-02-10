/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * December 2018
 */

import * as net                   from "net";
import { Log }                    from "../igniter-log";

export class PortBindTest {
	constructor() {
	}

	/**
	 * Test if a TCP port is free and able to bind to
	 * @param portNum
	 */
	public portIsFree(portNum: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			let srv = net.createServer((socket) => { socket.end("COLDMIND.IGNITER"); });

			try {
				srv.listen(portNum, () => {
					Log.info("Listening on ::" + srv.address() );
					srv.close(() => {
						resolve(true);

					});
				});
			} catch (err) {
				Log.error("portIsFree :: err ::", err);
				resolve(false);
			}
		});
	}
}