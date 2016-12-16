

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