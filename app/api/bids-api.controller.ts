/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import "reflect-metadata";
import { inject, injectable }     from "inversify";
import { Interface }              from '@root/kernel.config';
import { Request }                from 'express';
import { Response }               from 'express';
import { Router }                 from 'express';
import { IRestApiController }     from '@api/api-controller';
import { Logger }                 from '@cli/cli.logger';
import { RestUtils }              from '@api/../utils/rest-utils';
import { BasketService }          from '@app/services/basket.service';
import { AnalyticsDb }            from '@db/analytics-db';
import { ApiRoutes }              from '@app/settings/api-routes';
import { BidsPubsub }             from '@pubsub/bids-pubsub';
import { ServiceRegistry }        from '@pubsub/service-registry';
import { ServiceType }            from '@pubsub-lib/pubsub-types';
import {ISessionBasket, SessionFlash} from '@zapModels/session-basket';
import {BasketUtils} from '@components/basket/basket-utils';

@injectable()
export class BidsApiController implements IRestApiController{
	debugMode: boolean;
	analyticsDb: AnalyticsDb;

	constructor(
		@inject("IBasketService") private basketService: BasketService,
		@inject("IPubsubController") private bidsPubsub: BidsPubsub,
		@inject("IServiceRegistry") private serviceRegistry: ServiceRegistry
	) {
		this.analyticsDb = new AnalyticsDb(); //TODO: INJECT INSTEAD
	}

	private getBasketExt(sessId: string, clearFlash: boolean = true): Promise<ISessionBasket> {
		let resultBasket: ISessionBasket;
		let scope = this;
		console.log("******* getBasket ::");

		function clearSessionFlash(sessBasket: ISessionBasket): Promise<ISessionBasket> {
			return new Promise((resolve, reject) => {
				sessBasket.flash = new SessionFlash();

				scope.basketService.saveBasketSession(sessId, sessBasket).then(data => {
					Logger.logYellow("clearFlash :: SessionBasket ::", data);
					resolve(sessBasket);
				}).catch(err => {
					Logger.logError("clearFlash :: error ::", err);
					reject(err);
				});


				/*
				scope.basketService.clearFlash(zsid).then(data => {
					Logger.logYellow("clearFlash :: SessionBasket ::", data);
					resolve(data);
				}).catch(err => {
					Logger.logError("clearFlash :: error ::", err);
					reject(err);
				});*/
			});
		}

		function getBasket(): Promise<ISessionBasket>  {
			return new Promise((resolve, reject) => {
				scope.basketService.getCurrentBasket(sessId).then(data => {
					resolve(data);
				}).catch(err => {
					Logger.logError("apiGetBasket :: err ::", err);
					reject(err);
				});
			});
		}

		async function execute(): Promise<void> {
			resultBasket = await getBasket();
			if (clearFlash) {
				resultBasket = await clearSessionFlash(resultBasket);
			}
		}

		return new Promise((resolve, reject) => {
			execute().then(res => {
				resolve(resultBasket);

			}).catch(err => {
				Logger.logError("BidsApiController :: err ::", err);
				reject(err);
			});
		});
	}

	private apiGetBasket(req: Request, resp: Response): void {
		let data = req.body;
		let zsid = data.zsid;
		let sessId = req.session.id;
		let remFlash = data.clearFlash;

		console.log("apiGetBasket :: BODY ::", data);
		console.log("apiGetBasket :: ZSID ::", zsid);
		console.log("apiGetBasket :: sessId ::", sessId);

		this.basketService.getCurrentBasket(zsid).then(data => {
			if (remFlash) {
				data.flash = new SessionFlash();

				this.basketService.saveBasketSession(sessId, data).then(res => {
					resp.json(data);
				}).catch(err => {
				});

			} else {
				resp.json(data);
			}

		}).catch(err => {
			Logger.logError("apiGetBasket :: err ::", err);
		});
	}

	private apiGetBasketE(req: Request, resp: Response): void {
		let data = req.body;
		let zsid = data.zsid;
		let clearFlash = data.clearFlash;
		let sessId = req.session.id;

		console.log("apiGetBasket :: BODY ::", data);
		console.log("apiGetBasket :: ZSID ::", zsid);
		console.log("apiGetBasket :: sessId ::", sessId);

		this.basketService.getCurrentBasket(zsid).then(data => {
			console.log("¤¤¤ BASKET BEFORE :: data ::");
			BasketUtils.showBasket(data);
		}).catch(err => {
			console.log("¤¤¤ BASKET BEFORE :: error ::", err);
		});

		console.log(" ");
		console.log(" ");
		console.log(" ");

		this.getBasketExt(sessId).then(basket => {
			console.log("¤¤¤ BASKET AFTER :: data ::");
			BasketUtils.showBasket(basket);
			resp.json(basket);
		}).catch(err => {
			Logger.logError("apiGetBasket :: err ::", err);
		});
	}

	private apiAddBasketItem(req: Request, resp: Response): void {
		let data = req.body;
		let code = data.code;
		let zsid = data.zsid;

		console.log("BIDS :: BODY ::", data);
		console.log("BIDS :: ZSID ::", zsid);
		console.log("BIDS :: CODE ::", code);

		let serviceCount = this.serviceRegistry.getServiceCount(ServiceType.VendorPriceService);

		this.doGetBids(code, zsid).then(res => {
			let payload = {
				success: true,
				scount: serviceCount
			};

			resp.json(payload);

		}).catch(err => {
			RestUtils.jsonSuccess(resp, false);
		});
	}

	private apiDeleteBasketItem(req: Request, resp: Response): void {
		let data = req.body;
		let code = data.code;
		let zsid = data.zsid;

		let sessId = req.session.id;

		console.log("REMOVING ITEM :: BODY ::", data);
		console.log("REMOVING ITEM :: ZSID ::", zsid);
		console.log("REMOVING ITEM :: CODE ::", code);

		this.basketService.removeItem(code, zsid).then(res => {
			RestUtils.jsonSuccess(resp, true);
		}).catch(err => {
			RestUtils.jsonError(resp);
		});
	}

	private apiReviewBasket(req: Request, resp: Response): void {
		let data = req.body;
		let zsid = data.zsid;
		let sessId = req.session.id;

		console.log("BASKET :: SESSION ID ::", sessId);
		console.log("BASKET :: ZSID ::", zsid);

		this.basketService.getReviewData(zsid).then(res => {
			//console.log("apiReviewBasket ::", JSON.stringify(res));
			resp.json(res);

		}).catch(err => {
			Logger.logError("apiReviewBasket :: err ::", err);
		});
	}

	public remBasket(req: Request, resp: Response): void {
		let code = req.query.code;
		let sessId = req.query.sessId ? req.query.sessId : req.session.id;

		console.log("Using sessId ::", sessId);
		console.log("Using code ::", code);

		this.basketService.getSessionBasket(sessId).then(basket => {
			console.log("All items ::", basket.allItems);
			let res = JSON.stringify(basket);

			this.basketService.removeFromAll(basket, code);

			resp.json(basket);

		}).catch(err => {
			console.log("Error getting sessBasket ::", err);
			resp.json(err);
			// resp.end(JSON.stringify(err));
		});
	}

	private clearBasket(req: Request, resp: Response): void {
		let sessId = req.session.id;

		this.basketService.clearBasket(sessId).then(res => {
			resp.json(res);
		}).catch(err => {
			resp.json(err);
		});
	}

	public initRoutes(routes: Router): void {
		routes.post(ApiRoutes.Basket.GET_BASKET,            this.apiGetBasket.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_ADD,       this.apiAddBasketItem.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_DELETE,    this.apiDeleteBasketItem.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_REVIEW,    this.apiReviewBasket.bind(this));
		routes.post(ApiRoutes.Basket.POST_BASKET_CLEAR,     this.clearBasket.bind(this));

		routes.get("/brem",    this.remBasket.bind(this));
	}

	public doGetBids(code: string, sessId: string): Promise<boolean> {
		let result: boolean = true;

		return new Promise((resolve, reject) => {
			Logger.log(`BasketChannelController :: doGetOffers`);
			this.bidsPubsub.getBid(code, sessId).then(res => {
				Logger.logPurple("BidsApiController :: doGetBids :: " + code + " ::", sessId);
				resolve(true);
			}).catch(err => {
				Logger.logError("BidsApiController :: err ::", err);
				resolve(false);
			});
		});
	}
}
