/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ChannelService } from '@app/services/channel.service';
import {ZapMessageType} from '@zapModels/messages/zap-message-types';
import {ChannelMessage} from '@pubsub/channel-message';
import {DroneChannel} from '@pubsub/channel-info';
import {ChannelNames} from '@pubsub/channel-config';


export class Drone {
	constructor() {


		let drone = new Scaledrone("wnQpxZuJgaUChUul");

		let service = new ChannelService();
		let messData = new ChannelMessage(ZapMessageType.GetOffers, {code: "0887195000424"}, "A405CP");
		//console.log("Drone :: Emitting ::",JSON.stringify(messData));


		service.testNotify();
	}
}

let drone = new Drone();