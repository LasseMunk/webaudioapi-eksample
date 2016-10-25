// Daniel Shiffman on express and node.js 
// https://www.youtube.com/watch?v=2hhEOGXcCvg
// https://www.youtube.com/watch?v=HZWmrt3Jy10

var express = require('express'); 			// import express
var app = express();						// express is a function call which create an
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){				// begins a server which listens on port 3000
  console.log('listening on *:3000');
});

// use node.js to run the server, in terminal: cd ..\to-directory node server.js
// http://localhost:3000
// or specify the ip-adress of the host computer

app.use(express.static('public')); 	// serve the static files found in the 'public' folder

// javascript is eventbased. Examples of events of the io socket is 
// when a connection is established to a client, a message is received / sent, disconnection.


/* ---------------------------------------------

	generate client side files from src folder

   -------------------------------------------- */ 
var fs = require('fs'); // is used to create our client side files from the src directory




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
}

io.sockets.on('toServer', incMsg);
	function incMsg(lol) {
		console.log(lol);
		console.log("hej");
	}

/****************
 * OSC Over UDP *
 ****************/

// When sending OSC from Max --> server, use /your-osc-message to avoid errors

var osc = require("osc");

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 57121
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
});

udpPort.on("message", function (oscMessage) {
    console.log(oscMessage);
    io.sockets.emit("message", oscMessage);
});

udpPort.on("error", function (err) {
    console.log(err);
});

udpPort.open();

/****************
 * OSC THE END  *
 ****************/