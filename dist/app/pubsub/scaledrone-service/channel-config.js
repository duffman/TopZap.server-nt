'use strict';Object.defineProperty(exports,'__esModule',{value:true});class ChannelNames{}ChannelNames.Basket='Basket';ChannelNames.Bids='Bids';ChannelNames.Service='Service';exports.ChannelNames=ChannelNames;class MessagePipes{}MessagePipes.GetBid='getBid';MessagePipes.GetReview='getReview';MessagePipes.GetBestBasket='getBest';MessagePipes.NewBid='newBid';MessagePipes.Service='service';exports.MessagePipes=MessagePipes;const ChannelDef=[{name:ChannelNames.Basket,channelID:'wnQpxZuJgaUChUul',secretKey:'z2EWz4zXdNr63YUiwavv5kpdahRYfXxC'},{name:ChannelNames.Bids,channelID:'0RgtaE9UstNGjTmu',secretKey:'Q8ZcaFTMQTReingz9zNJmKjuVgnVYvYe'},{name:ChannelNames.Service,channelID:'T4eUrfAVDy7ODb0h',secretKey:'RyoF4UUVHCw6jEU1JtscfhNGaGsJrgF7'}];class ChannelConfig{constructor(){}static getDroneChannel(name){let result;for(const channel of ChannelDef){if(channel.name===name){result=channel;break;}}return result;}static getChannelId(name){let channelDef=ChannelConfig.getDroneChannel(name);if(channelDef){return channelDef.channelID;}else{return null;}}}exports.ChannelConfig=ChannelConfig;