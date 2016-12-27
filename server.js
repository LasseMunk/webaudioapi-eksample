// Daniel Shiffman on express and node.js 
// https://www.youtube.com/watch?v=2hhEOGXcCvg
// https://www.youtube.com/watch?v=HZWmrt3Jy10

var express = require('express'); 			// import express
var app = express();						// express is a function call which create an
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(client){
      clientConnect(client); // call function when client is connecting

  client.on('event', function(data){
      // add event logic
  });
  
  client.on('disconnect', function(){
      clientDisconnect(client); // call function when client is disconnecting
  });
});


http.listen(3000, function(){				// begins a server which listens on port 3000
  console.log('listening on *:3000');
});

// use node.js to run the server, in terminal: cd ..\to-directory node server.js
// http://localhost:3000
// or specify the ip-adress of the host computer

app.use(express.static('public')); 	// serve the static files found in the 'public' folder

// javascript is eventbased. Examples of events of the io socket is 
// when a connection is established to a client, a message is received / sent, disconnection.


var clientIds = []; // array which takes care of connected IDs

/* ---------------------------------------------

	generate client side files from src folder

   -------------------------------------------- */ 

function clientConnect(socket) {

	// there exist a socket, when a new connection is made. Therefore the argument
	// is the socket.

	// There has to be code in the client which tells the client to connect
	// to the server (and triggers the new connection event). 
			
			// Add a reference to the socket.io library in the index.html
			// Write the socket.io code in the UI (or what-ever js). 


	// console.log(socket); // if you .log the variable socket, you get a lot of metadata.

	//console.log("newConnection: " + socket.id); // show the new user id
    
    clientIds.push(socket.id);
    console.log ("connected, clients array: " + clientIds);
    sendClientLength(clientIds.length); // send the length of the new array to MAX
}

function clientDisconnect (socket) {
    
    var i = clientIds.indexOf(socket);
    clientIds.splice(i, 1); // delete socket.id from clientIds array
    
    console.log ("disconnected, clients array: " + clientIds);
    sendClientLength(clientIds.length); // send the length of the new array to MAX
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
    // socket server ip
    localAddress: "127.0.0.1",
    localPort: 57121,

    // MAX ip and port
    remoteAddress: "127.0.0.1",
    remotePort: 57120
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
});

udpPort.on("message", function (oscMessage) {
    /*

    args[0]:
    0:      send to all
    1 -> :  send to specific index

    args[1]:
        function:
            - play
            - synthParams

    */
    
    if (oscMessage.args[0] == 0) {
        io.sockets.emit("message", oscMessage);   // send to all
    };

    if  (oscMessage.args[0] > 0) {                // send to specific client
        
        var clientIndex = oscMessage.args[0] - 1; // since array index begins from 0
        io.sockets.connected[clientIds[clientIndex]].emit('message', oscMessage);  
    };
});

udpPort.on("error", function (err) {
    console.log(err);
});

udpPort.open();

function sendClientLength(length) {     // send to MAX

    var msg = {
        address: "/clientArrayLength",  // OSC namespace
        args: [length]                  // OSC argument
    };

    udpPort.send(msg);                  // send OSC mesasge
};


/****************
 * OSC THE END  *
 ****************/