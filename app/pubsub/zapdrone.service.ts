/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { ScaledroneClient } from "@app/pubsub/scaledrone-service/scaledrone-client";
import { ChannelNames, ChannelConfig } from "@app/pubsub/scaledrone-service/channel-config";

export class ZapdroneService {
	constructor() {
		let drone = new ScaledroneClient(ChannelNames.Bids);
	}
}