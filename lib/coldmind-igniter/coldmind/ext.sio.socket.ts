/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import {Client, Server, Adapter, EngineSocket, Handshake, Socket, Packet, Namespace} from 'socket.io';

export interface ExtSioSocket extends NodeJS.EventEmitter{

	/**
	 * The namespace that this socket is for
	 */
	nsp: Namespace;

	/**
	 * The Server that our namespace is in
	 */
	server: Server;

	/**
	 * The Adapter that we use to handle our rooms
	 */
	adapter: Adapter;

	/**
	 * The unique ID for this Socket. Regenerated at every conn. This is
	 * also the name of the room that the Socket automatically joins on conn
	 */
	id: string;

	/**
	 * The http.IncomingMessage request sent with the conn. Useful
	 * for recovering headers etc
	 */
	request: any;

	/**
	 * The Client associated with this Socket
	 */
	client: Client;

	/**
	 * The underlying Engine.io Socket instance
	 */
	conn: EngineSocket;

	/**
	 * The list of rooms that this Socket is currently in, where
	 * the ID the the room ID
	 */
	rooms: { [id: string]: string };

	/**
	 * Is the Socket currently connected?
	 */
	connected: boolean;

	/**
	 * Is the Socket currently disconnected?
	 */
	disconnected: boolean;

	/**
	 * The object used when negociating the handshake
	 */
	handshake: Handshake;
	/**
	 * Sets the 'json' flag when emitting an event
	 */
	json: Socket;

	/**
	 * Sets the 'volatile' flag when emitting an event. Volatile messages are
	 * messages that can be dropped because of network issues and the like. Use
	 * for high-volume/real-time messages where you don't need to receive *all*
	 * of them
	 */
	volatile: Socket;

	/**
	 * Sets the 'broadcast' flag when emitting an event. Broadcasting an event
	 * will send it to all the other sockets in the namespace except for yourself
	 */
	broadcast: Socket;

	/**
	 * Targets a room when broadcasting
	 * @param room The name of the room that we're targeting
	 * @return This Socket
	 */
	to( room: string ): Socket;

	/**
	 * @see to( room )
	 */
	in( room: string ): Socket;

	/**
	 * Registers a middleware, which is a function that gets executed for every incoming Packet and receives as parameter the packet and a function to optionally defer execution to the next registered middleware.
	 *
	 * Errors passed to middleware callbacks are sent as special error packets to clients.
	 */
	use( fn: ( packet: Packet, next: (err?: any) => void ) => void ): Socket;

	/**
	 * Sends a 'message' event
	 * @see emit( event, ...args )
	 */
	send( ...args: any[] ): Socket;

	/**
	 * @see send( ...args )
	 */
	write( ...args: any[] ): Socket;

	/**
	 * Joins a room. You can join multiple rooms, and by default, on conn,
	 * you join a room with the same name as your ID
	 * @param name The name of the room that we want to join
	 * @param fn An optional callback to call when we've joined the room. It should
	 * take an optional parameter, err, of a possible error
	 * @return This Socket
	 */
	join( name: string|string[], fn?: ( err?: any ) => void ): Socket;

	/**
	 * Leaves a room
	 * @param name The name of the room to leave
	 * @param fn An optional callback to call when we've left the room. It should
	 * take on optional parameter, err, of a possible error
	 */
	leave( name: string, fn?: Function ): Socket;

	/**
	 * Leaves all the rooms that we've joined
	 */
	leaveAll(): void;

	/**
	 * Disconnects this Socket
	 * @param close If true, also closes the underlying conn
	 * @return This Socket
	 */
	disconnect( close?: boolean ): Socket;

	/**
	 * Returns all the callbacks for a particular event
	 * @param event The event that we're looking for the callbacks of
	 * @return An array of callback Functions, or an empty array if we don't have any
	 */
	listeners( event: string ):Function[];

	/**
	 * Sets the compress flag
	 * @param compress If `true`, compresses the sending data
	 * @return This Socket
	 */
	compress( compress: boolean ): Socket;

	// Duffman
	session: any;

	token: string;
}