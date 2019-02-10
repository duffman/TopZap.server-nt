/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { SessionService }         from '@app/services/session.service';
import {ISessionBasket} from '@zapModels/session-basket';

export interface IBasketSessionService {
}

export class BasketSessionService implements IBasketSessionService {
	sessService: SessionService;

	constructor() {
		this.sessService = new SessionService();
	}

	public getBasket(sessId: string): ISessionBasket {
		let result: ISessionBasket;
		let data = this.sessService.getEntry(sessId, "basket");
		return result;
	}
}
