 /**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


import { EventEmitter }           from 'events';
import { ChannelConfig }          from './channel-config';
import { DroneEvents }            from './drone-events';

export interface IChannel {
	onChannelOpen(listener: any): void;
	onChannelData(listener: any): void;
	onChannelError(listener: any): void;
	onChannelClose(listener: any): void;
	onChannelDisconnect(listener: any): void;
	onChannelReconnect(listener: any): void;
}

export class Channel {
	protected drone: any;
	protected channel: any;
	private eventEmitter: EventEmitter;

	constructor(public roomName: string, watch: boolean = false) {

	}

	private attachEventHandlers() {
		let channel = this.channel;

		channel.on(DroneEvents.Open, data => {
			this.eventEmitter.emit(DroneEvents.Open, data);
		});

		channel.on(DroneEvents.Data, data => {
			this.eventEmitter.emit(DroneEvents.Data, data);
		});

		channel.on(DroneEvents.Error, data => {
			this.eventEmitter.emit(DroneEvents.Error, data);
		});

		channel.on(DroneEvents.Close, data => {
			this.eventEmitter.emit(DroneEvents.Close, data);
		});

		channel.on(DroneEvents.Disconnect, data => {
			this.eventEmitter.emit(DroneEvents.Disconnect, data);
		});

		channel.on(DroneEvents.Reconnect, data => {
			this.eventEmitter.emit(DroneEvents.Reconnect, data);
		});
	}


	public onChannelOpen(listener: any): void {
		this.eventEmitter.addListener(DroneEvents.Open, listener);
	}

	public onChannelData(listener: any): void {
		this.eventEmitter.addListener(DroneEvents.Data, listener);
	}

	public onChannelError(listener: any): void {
		this.eventEmitter.addListener(DroneEvents.Error, listener);
	}

	public onChannelClose(listener: any): void {
		this.eventEmitter.addListener(DroneEvents.Close, listener);
	}

	public onChannelDisconnect(listener: any): void {
		this.eventEmitter.addListener(DroneEvents.Disconnect, listener);
	}

	public onChannelReconnect(listener: any): void {
		this.eventEmitter.addListener(DroneEvents.Reconnect, listener);
	}
}
