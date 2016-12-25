

var LasseSynth = function() { // funktion som returnerer et object

    var static_private_var = 10; 
    // denne variabel kan bruges til værdier som er lokale for dette
    // object 

    this.frequency = 100;
    // this. variabler kan tilgås fra andre filer ved at sige LasseSynth.frequency

    this.playSound = function(var dur) {
        // play sound dur seconds
    };

};

myLasseSynth = new LasseSynth();
// Initiate et object fra klasse

myLasseSynth.playSound(1); // play sound med duration 1 second


myOtherLasseSynth = new LasseSynth(); 




/* sOCKET  IO COMMANDS

// sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');

 */