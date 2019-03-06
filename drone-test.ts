/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { DroneEvents }            from './app/pubsub/scaledrone-service/drone-events';
import { ChannelNames }           from './app/pubsub/scaledrone-service/channel-config';
import { MessagePipes }           from './app/pubsub/scaledrone-service/channel-config';
import { ScaledroneClient }       from './app/pubsub/scaledrone-service/scaledrone-client';

let channelName = ChannelNames.BidsTest;
console.log("Bids Channel Name ::", channelName);

let bidsDrone = new ScaledroneClient(channelName);
let channel = bidsDrone.subscribe(MessagePipes.GetBid); // <- suscribe on service client

channel.on(DroneEvents.Open, error => {
	if (error) {
		//reject(false);
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Service Error ::", error);
	} else {
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Service Started!");
		//resolve(true);
	}
});

channel.on(DroneEvents.Error, err => {
	console.log("ERROR ::", err);
});

channel.on(DroneEvents.Data, data => {
	console.log("DATA ::", data);
});

channel.on(DroneEvents.Close, () => {
	console.log("** CLOSE");
});

channel.on(DroneEvents.Reconnect, (data) => {
	console.log("** RECONNECT");
});
