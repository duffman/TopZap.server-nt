/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { LoggingDb }              from '@db/log-db-ts';
import { injectable }             from 'inversify';

export module LogSection {
	export const Basket = 'basket';
	export const Service = 'service';
	export const Debug = 'debug';
}

export interface ILoggingService {
	clear(): Promise<boolean>;
	log(section: string, prefix: string, value: any, code: number): Promise<boolean>;
	logService(prefix: string, value: any, code: number): Promise<boolean>;
	logBasket(prefix: string, value: any, code: number): Promise<boolean>;
}

@injectable()
export class LoggingService implements ILoggingService {
	dbService: LoggingDb;

	constructor() {
		this.dbService = new LoggingDb();
	}

	public clear(): Promise<boolean>  {
		return this.dbService.clearLog();
	}

	public logService(prefix: string, value: any, code: number = -1): Promise<boolean> {
		return this.dbService.doLog(LogSection.Service, prefix, value, code);
	}

	public logBasket(prefix: string, value: any, code: number = -1): Promise<boolean> {
		return this.dbService.doLog(LogSection.Basket, prefix, value, code);
	}

	public log(prefix: string, section: string, value: any, code: number): Promise<boolean> {
		return this.dbService.doLog(section, prefix, value, code);
	}
}
