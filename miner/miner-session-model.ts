/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */
export class MinerSessionModel {
	constructor(
		public id: number,
		public sessionKey: string,
		public minerName: string,
		public created: string,
		public vendorId: number,
		public completed: number,
	) {}
}

export interface IMinerWorkItem {
	id: number;
	barcode: string;
}

export class MinerWorkItemExt implements IMinerWorkItem {
	constructor(
		public id: number,
		public sessionId: number,
		public barcode: string,
		public price: string,
		public message: string,
		public processedWhen: string
	) {}
}

export class MinerWorkItemUpdate {
	constructor(
		public id: number,
		public sessionId: number,
		public accepted: boolean,
		public title: string,
		public price: number,
		public message: string
	) {}
}

export class MinerErrorLogEntry  {
	constructor(
		public queueId: number,
		public vendorId: number,
		public sessionId: number,
		public message: string,
		public errorMessage: string
	) {}
}

export class WorkItemUpdateRes {
	constructor(
		public itemId: number,
		public sessionId: number,
		public success: boolean
	) {}
}

export class MinerWorkItem implements IMinerWorkItem {
	constructor(
		public id: number,
		public barcode: string,
	) {}
}