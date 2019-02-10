/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export module SocketEvents {
	export let NewConnection                 = "newConnection";
	export let ServerStarted                 = "serverStarted";
	export let ServerStartError              = "serverStartErr";
	export let SocketConnect                 = "connect";
	export let SocketDisconnect              = "disconnect";
	export let SocketClosed                  = "closed";
	export let NewMessage                    = "newMess";
	export let NewEvent                      = "newEvent";
	export let DataAvailable                 = "dataAvailable";
	export let ReConnect                     = "reconnect";
	export let Error                         = "error";
}
