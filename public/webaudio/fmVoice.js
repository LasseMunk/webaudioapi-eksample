// Global scope
var context = new AudioContext(); // Create audio context
								  // webkit prefix is no longer needed nor recommended

var lm_osc = {
  0: "sine",
  1: "square",
  2: "sawtooth",
  3: "triangle",
  4: "custom"
 }

var lm_filters = {
  0: "lowpass",
  1: "highpass",
  2: "bandpass",
  3: "lowshelf",
  4: "highshelf",
  5: "peaking",
  6: "notch",
  7: "allpass"
 }

var lm_fmOscCar = {
	type: lm_osc[0],
	freq: 100,
	gain: 1
}

var lm_fmOscMod = {
	type: lm_osc[0],
	freq: 100,
	gain: 1
}

var lm_fmFiltMain = {
	type: lm_filters[0],
	freq: 400,
	gain: 1,
	Q: 1
}

var lm_fmAmpEnv = {
	attack: 0.005,
	decay: 0.1
}

var lm_fmPan = 0;
var lm_fmMstrGain = 0;

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


 /* 
	Oscillator types are:
	- sine
	- square
	- sawtooth
	- triangle
	- custom:         https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/setPeriodicWave
	- creating noise: http://noisehack.com/generate-noise-web-audio-api/ 
	*/

	var now = context.currentTime;
	var attackPlusNow = 0;

	// CREATE OSCILLATORS

	this.osc_carrier 	= context.createOscillator(); // create an oscillator
	this.osc_modulator 	= context.createOscillator(); // create an oscillator

	this.osc_carrier.type 	= lm_fmOscCar.type;
	this.osc_modulator.type  = lm_fmOscMod.type;


	this.osc_carrier.frequency.value   	= lm_fmOscCar.freq; 				// initial frequency
	this.osc_modulator.frequency.value 	= lm_fmOscMod.freq; 			
	
	// CREATE FLITER
	this.mainFilter = context.createBiquadFilter();

	// CREATE LIMITER
	// https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#DynamicsCompressorNode

	 this.limiter = context.createDynamicsCompressor();
	 this.limiter.threshold = 0; 	 // in dB
	 this.limiter.knee 		= 0;	
	 this.limiter.ratio 	= 5;
	 this.limiter.attack 	= 0.035; // in seconds
	 this.limiter.release 	= 0.080;  // in seconds

	// CREATE GAIN

	this.osc_carrierGain 	= context.createGain(); // create amplitude control
	this.osc_modulatorGain 	= context.createGain(); // create amplitude control

	this.mainFilterGain 	= context.createGain();

	this.mstrGain		 	= context.createGain(); // create amplitude control
	this.panStereo 			= context.createStereoPanner();

	this.osc_carrierGain.gain.value 	= lm_fmOscCar.gain; 				// initial amplitude
	this.osc_modulatorGain.gain.value 	= lm_fmOscMod.gain;

	this.mstrGain.gain.value 			= lm_fmMstrGain;

	

	/*  --------------- CONNECT AUDIO ROUTING --------------- */

	this.osc_modulator.connect(this.osc_modulatorGain); // connect osc to amplitude control
	this.osc_modulatorGain.connect(this.osc_carrier.frequency); // connect osc to amplitude control


	this.osc_carrier.connect(this.osc_carrierGain); // connect osc to amplitude control
	this.osc_carrierGain.connect(this.mainFilter);

	

	this.mainFilter.connect(this.mstrGain);
	this.limiter.connect(this.mstrGain);

	this.mstrGain.connect(this.panStereo); // connect the context to DAC
	this.panStereo.connect(context.destination)


	this.osc_carrier.start(context.currentTime); 	// generate sound instantly
	this.osc_modulator.start(context.currentTime); 	// generate sound instantly  

	this.updateSynthParams = function() {

		this.osc_modulator.frequency.value 	= lm_fmOscMod.freq;
		this.osc_modulatorGain.gain.value 	= lm_fmOscMod.gain;
		this.osc_modulator.type  			= lm_fmOscMod.type;
		this.osc_carrier.frequency.value 	= lm_fmOscCar.freq;
		this.osc_carrierGain.gain.value 	= lm_fmOscCar.gain;
		this.osc_carrier.type 				= lm_fmOscCar.type;
		
		this.mainFilter.type 				= lm_fmFiltMain.type;
		this.mainFilter.frequency.value 	= lm_fmFiltMain.freq;
		this.mainFilter.Q.value 			= lm_fmFiltMain.Q;
		this.mainFilter.gain.value 			= lm_fmFiltMain.gain;
		
		this.panStereo.pan.value 			= lm_fmPan;
		this.mstrGain.gain.value 			= lm_fmMstrGain;
	};

	this.ampEnv = function() {

			this.updateSynthParams();

			now = context.currentTime;
			//amp.attackPlusNow = parseFloat(amp.attackPlusNow);
			lm_fmAmpEnv.attack = parseFloat(lm_fmAmpEnv.attack);
			attackPlusNow = now + lm_fmAmpEnv.attack;

			this.osc_carrierGain.gain.cancelScheduledValues(0);
			
			// Amplitude envelope
			this.osc_carrierGain.gain.setValueAtTime(0, now);
			this.osc_carrierGain.gain.setTargetAtTime(1, now, lm_fmAmpEnv.attack);
			this.osc_carrierGain.gain.setTargetAtTime(0, attackPlusNow, lm_fmAmpEnv.decay); 
			// target value, start time, ramp time
			console.log(this.limiter.reduction);
		}
};

// var newVoice = new fmVoice();

var fmNumVoices = 8; // how many voices to instantiate
var fmVoices = [];	 // array to fill with fm-voices

for(i = 0; i < fmNumVoices; i++) { 	// instantiate fm voices 
	fmVoices[i] = new fmVoice();
	};

function osc_mapFmParameters (arg) {

// see arg[X] at each variable, to figure out how to control it via OSC

	lm_fmOscMod.freq 	= arg[2] * 40;
	lm_fmOscMod.gain 	= arg[3] * 1000;
	
	// scale 0. 1. -> 0 3, round to convert FLOAT -> INT and lookup in lm_osc object
	lm_fmOscMod.type 	= lm_osc[Math.round(lmUtil_scale(arg[ 4 ], [0., 1.], [0, 3]))];

	lm_fmOscCar.freq 	= (arg[5] * 1000) + 200;
	lm_fmOscCar.gain 	= arg[6];
	lm_fmOscCar.type	= lm_osc[Math.round(lmUtil_scale(arg[ 7 ], [0., 1.], [0, 3]))];

	lm_fmFiltMain.freq	= Math.pow((arg[8]*10), 4.3)+40; // exponential range 40 Hz -> ~20kHz
	lm_fmFiltMain.gain  = 1; // -100 -> 100 
	lm_fmFiltMain.type	= lm_filters[Math.round(lmUtil_scale(arg[ 10 ], [0., 1.], [0, 7]))];
	lm_fmFiltMain.Q		= arg[11] + 0.5; // move into range 0.5 -> 1.5

	lm_fmAmpEnv.attack 	= (Math.pow((arg[12]*15), 2.4)*0.001)+0.005; // in seconds	
	lm_fmAmpEnv.decay	= (Math.pow((arg[13]*15), 2.8)*0.001)+0.005; // in seconds
	
	lm_fmPan 			= (arg[14] - 0.5) * 2; // map to -1. to 1.
	lm_fmMstrGain 		= arg[15];
}
