/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

export module DroneApiRoutes {
	export const DRONE_GET_SESSION        = "/zap-session";
}

export module DroneChannelRooms {
	export const DRONE_SERVICE            = "service";
	export const DRONE_SERVICE_REG        = DroneChannelRooms.DRONE_SERVICE + "Reg";
	export const DRONE_SERVICE_UNREG      = DroneChannelRooms.DRONE_SERVICE + "Unreg";
	export const DRONE_SERVICE_PING       = DroneChannelRooms.DRONE_SERVICE + "Ping";
	export const DRONE_SERVICE_PONG       = DroneChannelRooms.DRONE_SERVICE + "Pong";
	export const DRONE_SERVICE_DISCOVER   = DroneChannelRooms.DRONE_SERVICE + "Discover";
}
