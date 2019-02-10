/**

export class TestServer {
	constructor() {}
}

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {

	// Log whenever a user connects
	console.log('user connected');

	// Log whenever a client disconnects from our websocket server
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	// When we receive a 'message' event from our client, print out
	// the contents of that message and then echo it back to our client
	// using `io.emit()`
	socket.on('message', (message) => {
		console.log("Message Received: " + message);
		io.emit('message', {type:'new-message', text: message});
	});
});

// Initialize our websocket server on port 5000
http.listen(5000, () => {
	console.log('started on port 5000');
});

 */

import * as session               from "express-session";

let app = require('express')();
let http = require('http').Server(app);
let sio = require('socket.io')(http);

let sessionMiddleware = session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }});

sio.use(function(socket, next) {
	sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

app.get("/", function(req, res){
	req.session // Session object in a normal request
});

/*sio.sockets.on("conn", function(socket) {
	socket.request.session // Now it's available from Socket.IO sockets too! Win!
});
*/
sio.on('connection', (socket) => {
	socket.request.session // Now it's available from Socket.IO sockets too! Win!


	// Log whenever a user connects
	console.log('user connected');

	// Log whenever a client disconnects from our websocket server
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	// When we receive a 'message' event from our client, print out
	// the contents of that message and then echo it back to our client
	// using `io.emit()`
	socket.on('message', (message) => {
		console.log("Message Received: " + message);
		sio.emit('message', {type:'new-message', text: message});
	});
});

http.listen(8080);