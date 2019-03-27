/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { inject, injectable }     from "inversify";
import { IPBService }             from '@pubsub-lib/pubsub-types';

export interface IVendorService {
	vendorId: number;
	vendorName: string;
}

export interface IServiceRegistry {
	getServiceOfType(type: string): IPBService[];
	getService(type: string, id: number): IPBService;
	registerService(service: IPBService);
	getServiceCount(serviceType: string): number;
}

@injectable()
export class ServiceRegistry implements IServiceRegistry {
	services: IPBService[];
	pingTimer: any;

	constructor() {
		this.services = new Array<IPBService>();
	}

	private startPingTimer(): void {
		this.pingTimer = setTimeout(() => { this.pingService(); }, 10000);
	}

	private pingService(): void {

	}

	public getServiceOfType(type: string): IPBService[] {
		let result: IPBService[] = new Array<IPBService>();
		for (let service of this.services) {
			if (service.type === type) {
				result.push(service);
			}
		}

		return result;
	}


	public getService(type: string, id: number): IPBService {
		let result: IPBService = null;
		for (let service of this.services) {
			if (service.type === type && service.id === id) {
				result = service;
				break;
			}
		}

		//TODO: Check Last ping

		return result;
	}

	public registerService(service: IPBService) {
		if (this.getService(service.type, service.id) === null) {
			this.services.push(service);
		}
	}

	public getServiceCount(serviceType: string): number {
		let services = this.getServiceOfType(serviceType);
		return services === null ? 0 : services.length;
	}
}
