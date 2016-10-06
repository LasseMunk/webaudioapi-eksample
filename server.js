// Daniel Shiffman on express and node.js 
// https://www.youtube.com/watch?v=2hhEOGXcCvg
// https://www.youtube.com/watch?v=HZWmrt3Jy10

var express = require('express'); 	// import express
var app = express();				// express is a function call which create an application
									// and stores in the variable app

var server = app.listen(3000);		// begins a server which listens on port 3000

// use node.js to run the server, in terminal: cd ..\to-directory node server.js
// http://localhost:3000
// or specify the ip-adress of the host computer

app.use(express.static('public'));	// have express display the static files, found in the
									// folder public


console.log("socket server is running");

var socket = require('socket.io'); 	// library which setups web-sockets (connections
									// between server and clients)

var io = socket(server);		 	// io-object keeps track of messages in/out. 
									// The argument is the  webserver

// javascript is eventbased. Examples of events of the io socket is 
// when a connection is established to a client, a message is received / sent, disconnection.

io.sockets.on('connection', newConnection); // when there is a new connection, call function
											// newConnection

function newConnection(socket) {

// there exist a socket, when a new connection is made. Therefore the argument
// is the socket.

// There has to be code in the client which tells the client to connect
// to the server (and triggers the new connection event). 
		
		// Add a reference to the socket.io library in the index.html
		// Write the socket.io code in the UI (or what-ever js). 


// console.log(socket); // if you .log the variable socket, you get a lot of metadata.

console.log("newConnection: " + socket.id); // show the new user id

socket.on('mouse', mouseMsg); // if there is a message called 'mouse', call function
							  // mouseMsg

function mouseMsg(data) {	  // the content of the 'mouse' message, is logged
	console.log(data);		 
}
 
}