/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import * as Scaledrone            from 'scaledrone-node';
import { EventEmitter }           from 'events';
import { ChannelConfig }          from './channel-config';
import { DroneEvents }            from './drone-events';
import { IDroneModule }           from "@pubsub/zapdrone-service/drone-module";

export class MessQueueEntry {
	constructor(public roomName: string, public data: any) {}
}

export class ScaledroneClient implements IDroneModule {
	isOpen: boolean;
	drone: any;
	private eventEmitter: EventEmitter;
	messageQueue: MessQueueEntry[];

	constructor(channelKey: string) {
		this.eventEmitter = new EventEmitter();
		this.messageQueue = new Array<MessQueueEntry>();

		let channelInfo = ChannelConfig.getDroneChannel(channelKey);

		if (channelInfo === null) {
			let error = new Error("Channel not found");
			throw error;
		}

		this.drone = new Scaledrone(channelInfo.channelID);

		this.attachEventHandlers();
	}

	public subscribe(pipeName: string): any {
		return this.drone.subscribe(pipeName);
	}

	private openChannel(): void {
		this.isOpen = true;

		console.log("--- Open Channel ---");

		while(this.messageQueue.length > 0) {
			let entry = this.messageQueue.pop() as MessQueueEntry;
			console.log("Emitting Queued message ::", entry);
			this.drone.publish({room: entry.roomName, message: entry.data });
		}
	}

	private closeChannel(): void {
		console.log("--- Close Channel ---");
		this.isOpen = false;
	}

	private attachEventHandlers() {
		this.drone.on(DroneEvents.Open, error => {
			console.log(DroneEvents.Open, error);

			if (!error) {
				this.openChannel();
			}

			this.eventEmitter.emit(DroneEvents.Open, error);
		});

		this.drone.on(DroneEvents.Data, data => {
			console.log(DroneEvents.Data, data);
			this.eventEmitter.emit(DroneEvents.Data, data);
		});

		this.drone.on(DroneEvents.Error, data => {
			console.log(DroneEvents.Error, data);
			this.eventEmitter.emit(DroneEvents.Error, data);
		});

		this.drone.on(DroneEvents.Close, data => {
			console.log(DroneEvents.Close, data);
			this.closeChannel();
			this.eventEmitter.emit(DroneEvents.Close, data);
		});

		this.drone.on(DroneEvents.Disconnect, data => {
			this.closeChannel();
			console.log(DroneEvents.Disconnect, data);
			this.eventEmitter.emit(DroneEvents.Disconnect, data);
		});

		this.drone.on(DroneEvents.Reconnect, error => {
			if (!error) {
				this.openChannel();
			}

			console.log(DroneEvents.Reconnect, error);
			this.eventEmitter.emit(DroneEvents.Reconnect, error);
		});
	}

	public emitMessage(message: any, roomName: string) {
		console.log("Emitting to Pipe '" + roomName + "'");
		this.emitRaw(roomName, message);
	}

	public emitRaw(messagePipe: string, data: any) {
		if (!this.isOpen) {
			let queueEntry = new MessQueueEntry(messagePipe, data);
			console.log("Queueing Message ::", data);
			this.messageQueue.push(queueEntry);
		} else {
			this.drone.publish({room: messagePipe, message: data});
		}
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
