/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

export module DronePipes {
	export const DRONE_SERVICE            = "service";
	export const DRONE_SERVICE_REG        = DronePipes.DRONE_SERVICE + "Reg";
	export const DRONE_SERVICE_UNREG      = DronePipes.DRONE_SERVICE + "Unreg";
	export const DRONE_SERVICE_PING       = DronePipes.DRONE_SERVICE + "Ping";
	export const DRONE_SERVICE_PONG       = DronePipes.DRONE_SERVICE + "Pong";
	export const DRONE_SERVICE_DISCOVER   = DronePipes.DRONE_SERVICE + "Discover";
}
