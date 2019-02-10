/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { IgniterMessageType } from '@igniter/messaging/igniter-messages';

export class MessageUtils {
	public static validateMessageType(dataObj: any): boolean {
		return (dataObj as IgniterMessageType) !== null;
	}
}