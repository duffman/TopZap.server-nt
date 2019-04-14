/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { SessionService }         from '@app/services/session.service';
import {ISessionBasket, SessionBasketInfo, SessionFlash} from '@zapModels/session-basket';
import { SessionBasket }          from '@zapModels/session-basket';
import { Logger }                 from '@cli/cli.logger';

export interface IBasketSessionService {
	getSessionBasket(sessId: string): Promise<ISessionBasket>;
	saveSessionBasket(sessId: string, basket: ISessionBasket): Promise<boolean>;
}

export class BasketSessionService implements IBasketSessionService {
	sessService: SessionService;

	constructor() {
		this.sessService = new SessionService();
	}

	public getSessionBasket(sessId: string): Promise<ISessionBasket> {
		let result: ISessionBasket;

		return new Promise((resolve, reject) => {
			return this.sessService.getSession(sessId).then(data => {
				result = data as ISessionBasket;
				if (!result) {
					result = new SessionBasket();
				}

				if (!result.info) {
					result.info = new SessionBasketInfo();
				}


				resolve(result);

			}).catch(err => {
				Logger.logError("BasketSessionService :: getSessionBasket", err);
			})
		});
	}



	public saveSessionBasket(sessId: string, basket: ISessionBasket): Promise<boolean> {
//		basket.flash = new SessionFlash(); // Reset the flash message

		return new Promise((resolve, reject) => {
			return this.sessService.saveSession(sessId, basket).then(res => {
				resolve(res)

			}).catch(err => {
				reject(err);
			});
		});
	}
}
