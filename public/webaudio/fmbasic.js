// http://middleearmedia.com/web-audio-api-basics/
// http://meeech.amihod.com/getting-started-with-javascript-debugging-in-chrome/


/*

In order to use the Web Audio API, we must first create a container. 
This container is called an AudioContext. It holds everything else inside it. Keep in mind 
that only one AudioContext is usually needed. Any number of 
sounds can be loaded inside a single AudioContext. 

*/

var context = new AudioContext(); // Create audio context
				  // webkit prefix is no longer needed nor recommended

var amp = {
    attack: "0.005",
    decay: "0.01",
    attackPlusNow: "0"
};

var now = context.currentTime;

// CREATE OSCILLATORS

osc_carrier 	= context.createOscillator(); // create an oscillator
osc_modulator 	= context.createOscillator(); // create an oscillator

/* 
Oscillator types are:
 - sine
 - square
 - sawtooth
 - triangle
 - custom:         https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/setPeriodicWave)
 - creating noise: http://noisehack.com/generate-noise-web-audio-api/ 
 */

osc_carrier.type 	= 'sine';
osc_modulator.type  = 'sine';


osc_carrier.frequency.value   	= 400.; 				// initial frequency
osc_modulator.frequency.value 	= 4.; 			
		

osc_carrierGain 	= context.createGain(); // create amplitude control
osc_modulatorGain 	= context.createGain(); // create amplitude control

mstrGain		 	= context.createGain(); // create amplitude control


osc_carrierGain.gain.value 		= 0.; 				// initial amplitude
osc_modulatorGain.gain.value 	= 100.;

mstrGain.gain.value = 0.5;

panStereo = context.createStereoPanner();

/*  --------------- CONNECT AUDIO ROUTING --------------- */

osc_modulator.connect(osc_modulatorGain); // connect osc to amplitude control
osc_modulatorGain.connect(osc_carrier.frequency); // connect osc to amplitude control


osc_carrier.connect(osc_carrierGain); // connect osc to amplitude control
osc_carrierGain.connect(mstrGain);

mstrGain.connect(panStereo); // connect the context to DAC
panStereo.connect(context.destination)


osc_carrier.start(context.currentTime); 	// generate sound instantly
osc_modulator.start(context.currentTime); 	// generate sound instantly  


/*  --------------- SLIDER VALUES --------------- */

	document.getElementById("slider_modFreq").addEventListener('input', function () {		
																// 'input' create a continous input detection
																// alternative could be 'change'
		osc_modulator.frequency.value = this.value * 8; 
	});

	document.getElementById("slider_modGain").addEventListener('input', function () {		
		osc_modulatorGain.gain.value = this.value*1000; 
	});

	document.getElementById("osc_carrier_freq").addEventListener('input', function () { 	
		osc_carrier.frequency.value = (this.value*1000)+200; 
	});

	document.getElementById("mstrGain").addEventListener('input', function () { 	
		mstrGain.gain.value = this.value; 
	});

	document.getElementById("panStereo").addEventListener('input', function () { 	
		panStereo.pan.value = (this.value-0.5)*2; // pan range [-1., 1.]
	});

	document.getElementById("slider_ampAttack").addEventListener('input', function () { 	
		amp.attack = this.value; 
		amp.attack = parseFloat(amp.attack);


	});

	document.getElementById("slider_ampDecay").addEventListener('input', function () { 
		amp.decay = this.value; 
		amp.decay = parseFloat(amp.decay);
	});


function ampEnv() {

	now = context.currentTime;
    //amp.attackPlusNow = parseFloat(amp.attackPlusNow);
    amp.attack = parseFloat(amp.attack);
	amp.attackPlusNow = now + amp.attack;

	osc_carrierGain.gain.cancelScheduledValues(0);
	
	// Amplitude envelope
	osc_carrierGain.gain.setValueAtTime(0, now);
    osc_carrierGain.gain.setTargetAtTime(1, now, amp.attack);
    osc_carrierGain.gain.setTargetAtTime(0, amp.attackPlusNow, amp.decay); // target value, start time, ramp time

	}

/*  --------------- SEQUENCER --------------- */
/*
var isPlaying = false;      	// Are we currently playing?
var startTime;              	// The start time of the entire sequence.
var current16thNote;        	// What note is currently last scheduled?
var tempo = 120.0;          	// tempo (in beats per minute)
var lookahead = 25.0;       	// How frequently to call scheduling function 
                            	//(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            	// This is calculated from lookahead, and overlaps 
                            	// with next interval (in case the timer is late)
var nextNoteTime = 0.0;     	// when the next note is due.
var noteResolution = 0;     	// 0 == 16th, 1 == 8th, 2 == quarter note
var notesInQueue = [];      	// the notes that have been put into the web audio,
                            	// and may or may not have played yet. {note, time}
var timerWorker = null;     	// The Web Worker used to fire timer messages




function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution==1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution==2) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes

    // create an oscillator
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    if (beatNumber % 16 === 0)    // beat 0 == low pitch
        osc.frequency.value = 880.0;
    else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
        osc.frequency.value = 440.0;
    else                        // other 16th notes = high pitch
        osc.frequency.value = 220.0;

    osc.start( time );
    osc.stop( time + noteLength );
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}

function play() {
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}


function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

        last16thNoteDrawn = currentNote;
    }

    timerWorker = new Worker("js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});
}
*/
/*window.addEventListener("load", init );*/


