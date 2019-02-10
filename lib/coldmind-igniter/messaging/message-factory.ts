/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { MessageType }            from '@igniter/messaging/message-types';
import * as uuid4                 from "uuid/v4";
import { IZynMessage }               from '@igniter/messaging/igniter-messages';
import { ZynMessage }         from '@igniter/messaging/igniter-messages';

export class MessageFactory {
	public static newIgniterMessage(messageType: string, messageId: string, data: any = null, tag: string = null): IZynMessage {
		//data = data === null ? {} : data;
		tag = tag === null ? uuid4() : tag;
		let message = new ZynMessage(messageType, messageId, data, tag);
		return message;
	}
}
