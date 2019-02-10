/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * December 2018
 */

export module PuppetEvents {

	export module Client {


		export const Connect = "connect"; // Fired upon a successful conn
		export const ConnectError = "connect_error"; // Fired upon a conn error
		export const ConnectTimeout = "connect_timeout"; // Fired upon a conn timeout
		export const Reconnect = "reconnect"; // Fired upon a successful reconnection


		/*

		Parameters:
		Number reconnection attempt number

		reconnect_attempt. Fired upon an attempt to reconnect.

		reconnecting. Fired upon an attempt to reconnect.
		Parameters:
		Number reconnection attempt number

		reconnect_error. Fired upon a reconnection attempt error.
		Parameters:
		Object error object

		reconnect_failed. Fired when couldn’t reconnect within reconnectionAttempts
		*/

		export const Disconnect: string = "disconnect";
	}

	export module Server {
		export const Connection: string = "connection";
		export const Connect: string = "connect";
	}
}
