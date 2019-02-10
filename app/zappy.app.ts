/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * Provides the interface for Zap - Puppy apps, each Zappy is usually built as a MicroService
 */
export interface IZappyApp {
	debugMode: boolean;
	version: string;
	getAppVersion(): string;
	getSecret(): string;
}