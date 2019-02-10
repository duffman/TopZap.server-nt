/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { DateInterval }           from '@putte/date/DateInterval';

export module Settings {
	//export const allowedCORSOrigins = "*";
	export const allowedCORSOrigins = "http://127.0.0.1:4200";
	export const sessionCookieKey = "kaknyckel";
	export const sessionSecret = "1gulka9n";

	export module Caching {
		export const UseCachedOffers = true;
		export const CacheTTL = DateInterval.days(10); // 5760; // 4 days
	}

	export module PriceServiceApi {
		export const Endpoint = "http://localhost:6562";
	}

	export module MongoDb {
		export const mongoDbUrl = "mongodb://localhost:27017/TopZapDB";
	}

	export module Database {
		export const dbName = "topzap-prod";
		export const dbHost = "localhost";
		export const dbUser = "duffman";
		export const dbPass = "bjoe7151212";
	}
}