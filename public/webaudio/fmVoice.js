// Global scope
var context = new AudioContext(); // Create audio context
								  // webkit prefix is no longer needed nor recommended

// Local scope
var fmVoice = function () {

	// http://middleearmedia.com/web-audio-api-basics/
	// http://meeech.amihod.com/getting-started-with-javascript-debugging-in-chrome/


	/*
	In order to use the Web Audio API, we must first create a container. 
	This container is called an AudioContext. It holds everything else inside it. Keep in mind 
	that only one AudioContext is usually needed. Any number of 
	sounds can be loaded inside a single AudioContext. 
	*/


	this.amp = {
		attack: "0.005",
		decay: "0.01",
		attackPlusNow: "0"
	};

	var now = context.currentTime;

	// CREATE OSCILLATORS

	this.osc_carrier 	= context.createOscillator(); // create an oscillator
	this.osc_modulator 	= context.createOscillator(); // create an oscillator

	/* 
	Oscillator types are:
	- sine
	- square
	- sawtooth
	- triangle
	- custom:         https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/setPeriodicWave
	- creating noise: http://noisehack.com/generate-noise-web-audio-api/ 
	*/

	this.osc_carrier.type 	= 'sine';
	this.osc_modulator.type  = 'sine';


	this.osc_carrier.frequency.value   	= 400.; 				// initial frequency
	this.osc_modulator.frequency.value 	= 4.; 			
			

	this.osc_carrierGain 	= context.createGain(); // create amplitude control
	this.osc_modulatorGain 	= context.createGain(); // create amplitude control

	this.mstrGain		 	= context.createGain(); // create amplitude control


	this.osc_carrierGain.gain.value 	= 0.; 				// initial amplitude
	this.osc_modulatorGain.gain.value 	= 100.;

	this.mstrGain.gain.value = 0.5;

	this.panStereo = context.createStereoPanner();

	/*  --------------- CONNECT AUDIO ROUTING --------------- */

	this.osc_modulator.connect(this.osc_modulatorGain); // connect osc to amplitude control
	this.osc_modulatorGain.connect(this.osc_carrier.frequency); // connect osc to amplitude control


	this.osc_carrier.connect(this.osc_carrierGain); // connect osc to amplitude control
	this.osc_carrierGain.connect(this.mstrGain);

	this.mstrGain.connect(this.panStereo); // connect the context to DAC
	this.panStereo.connect(context.destination)


	this.osc_carrier.start(context.currentTime); 	// generate sound instantly
	this.osc_modulator.start(context.currentTime); 	// generate sound instantly  


	
	/*  --------------- SLIDER VALUES --------------- */

		document.getElementById("slider_modFreq").addEventListener('input', function () {		
																	// 'input' create a continous input detection
																	// alternative could be 'change'
			this.osc_modulator.frequency.value = this.value * 8; 
		});

		document.getElementById("slider_modGain").addEventListener('input', function () {		
			this.osc_modulatorGain.gain.value = this.value*1000; 
		});

		document.getElementById("osc_carrier_freq").addEventListener('input', function () { 	
			this.osc_carrier.frequency.value = (this.value*1000)+200; 
		});

		document.getElementById("mstrGain").addEventListener('input', function () { 	
			this.mstrGain.gain.value = this.value; 
		});

		document.getElementById("panStereo").addEventListener('input', function () { 	
			this.panStereo.pan.value = (this.value-0.5)*2; // pan range [-1., 1.]
		});

		document.getElementById("slider_ampAttack").addEventListener('input', function () { 	
			this.amp.attack = this.value; 
			this.amp.attack = parseFloat(this.amp.attack);


		});

		document.getElementById("slider_ampDecay").addEventListener('input', function () { 
			this.amp.decay = this.value; 
			this.amp.decay = parseFloat(this.amp.decay);
		});


	this.ampEnv = function() {

			now = context.currentTime;
			//amp.attackPlusNow = parseFloat(amp.attackPlusNow);
			this.amp.attack = parseFloat(this.amp.attack);
			this.amp.attackPlusNow = now + this.amp.attack;

			this.osc_carrierGain.gain.cancelScheduledValues(0);
			
			// Amplitude envelope
			this.osc_carrierGain.gain.setValueAtTime(0, now);
			this.osc_carrierGain.gain.setTargetAtTime(1, now, this.amp.attack);
			this.osc_carrierGain.gain.setTargetAtTime(0, this.amp.attackPlusNow, this.amp.decay); 
			// target value, start time, ramp time

		}
};

// var newVoice = new fmVoice();

var fmNumVoices = 8; // how many voices to instantiate
var fmVoices = [];	 // array to fill with fm-voices


for(i = 0; i < fmNumVoices; i++) { 	// instantiate fm voices 
	fmVoices[i] = new fmVoice();
	};
