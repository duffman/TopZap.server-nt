/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

export module DroneApiRoutes {
	export const DRONE_GET_SESSION        = "/zap-session";
	export const DRONE_SERVICE            = "/service/";
	export const DRONE_SERVICE_REG        = DroneApiRoutes.DRONE_SERVICE + "reg";
	export const DRONE_SERVICE_UNREG      = DroneApiRoutes.DRONE_SERVICE + "unreg";
	export const DRONE_SERVICE_PING       = DroneApiRoutes.DRONE_SERVICE + "ping";
	export const DRONE_SERVICE_PONG       = DroneApiRoutes.DRONE_SERVICE + "pong";
	export const DRONE_SERVICE_DISCOVER   = DroneApiRoutes.DRONE_SERVICE + "discover";
}
