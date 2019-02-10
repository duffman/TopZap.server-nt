/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Logger }                 from '@cli/cli.logger';
import { IChannelController }     from '@app/channels/channel.controller';
import { ChannelBaseController }  from '@app/channels/channel.base-controller';
import { ZapMessageType }         from '@zapModels/messages/zap-message-types';
import { MessageType }            from '@igniter/messaging/message-types';
import { ChannelNames }           from '@app/channels/channel-config';
import { ChannelMessage }         from '@app/channels/channel-message';
import { ISessionBasket }         from '@zapModels/session-basket';
import { BasketSessionService }   from '@app/services/basket-session.service';

export interface IBasketChannelController extends IChannelController {
}

export class BasketChannelController extends ChannelBaseController implements IChannelController{
	basketSessService: BasketSessionService;

	constructor() {
		super(ChannelNames.Basket, "bids");
		this.basketSessService = new BasketSessionService();
	}

	public emitGetOffersInit(sessId: string, data: any): void {
		let mess = new ChannelMessage(MessageType.Action, ZapMessageType.GetOffersInit, data, sessId);
		Logger.logYellow("EMIT ON CHANNEL :: emitGetOffersInit ::", mess);
		this.emitMessage(mess);
	}

	public emitVendorOffer(sessId: string, data: any): void {
		let mess = new ChannelMessage(MessageType.Action, ZapMessageType.VendorOffer, data, sessId);
		Logger.logYellow("EMIT ON CHANNEL :: emitVendorOffer ::", mess);
		this.emitMessage(mess);
	}

	public emitOffersDone(sessId: string): void {
		let mess = new ChannelMessage(MessageType.Action, ZapMessageType.GetOffersDone, {}, sessId);
		Logger.logYellow("EMIT ON CHANNEL :: emitOffersDone ::", mess);
		this.emitMessage(mess);
	}

	public getSessionBasket(sessId: string): ISessionBasket {
		let sessBasket = this.basketSessService.getBasket(sessId);
		return sessBasket;
	}
}
