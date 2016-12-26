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


/* --------------------------------------------------------------------------- */
/* ---------------------------   SYNTH VOICE   ------------------------------- */
/* --------------------------------------------------------------------------- */


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

	this.osc_carrier 					= context.createOscillator(); // create an oscillator
	this.osc_carrier.type 	 			= lm_fmOscCar.type;
	this.osc_carrier.frequency.value   	= lm_fmOscCar.freq; 				// initial frequency
	this.osc_carrierGain 				= context.createGain(); // create amplitude control
	this.osc_carrierGain.gain.value 	= lm_fmOscCar.gain;
	
	this.osc_modulator 					= context.createOscillator(); // create an oscillator
	this.osc_modulator.type  			= lm_fmOscMod.type;
	this.osc_modulator.frequency.value 	= lm_fmOscMod.freq; 			
	this.osc_modulatorGain 				= context.createGain(); // create amplitude control
	this.osc_modulatorGain.gain.value 	= lm_fmOscMod.gain;

	// CREATE FLITER
	this.mainFilter 				= context.createBiquadFilter();
	
	/*  --------------- CONNECT AUDIO ROUTING --------------- */

	this.osc_modulator.connect(this.osc_modulatorGain); // connect osc to amplitude control
	this.osc_modulatorGain.connect(this.osc_carrier.frequency); // connect osc to amplitude control

	this.osc_carrier.connect(this.osc_carrierGain); // connect osc to amplitude control
	this.osc_carrierGain.connect(this.mainFilter);
	
	this.osc_carrierGain.gain.value = 0; // no sound before ampEnv is triggered

	this.mainFilter.connect(fmOut.waveshaper);
	this.mainFilter.connect(fmOut.toDelay);

	/*  --------------- START OSCILLATORS --------------- */

	this.osc_carrier.start(context.currentTime); 	// generate sound instantly
	this.osc_modulator.start(context.currentTime); 	// generate sound instantly  

	/*  --------------- AUDIO ROUTING END --------------- */

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
			
			this.osc_modulator.stop(attackPlusNow+lm_fmAmpEnv.decay+0.5); // add 0.5 sec to 
			this.osc_carrier.stop  (attackPlusNow+lm_fmAmpEnv.decay+0.5); // make sure the env. is done
			// stop oscillators when done playing
	};
};


/* --------------------------------------------------------------------------- */
/* ---------------------------   OUTPUT MODULE 	  ---------------------------- */
/* --------------------------------------------------------------------------- */


function synthOutput() { // output module

	this.delayConfig = {
		toDelay: 0,
		time: 0.25,
		feedback: 0.8,
		freq: 500,
		width: 1
	}

	this.waveshaperConfig = {
		oversample: '4x',
		curveAmt: 20
	}

	// CREATE LIMITER
	// https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#DynamicsCompressorNode

	//  this.limiter = context.createDynamicsCompressor();
	//  this.limiter.threshold = 0; 	 // in dB
	//  this.limiter.knee 		= 0;	
	//  this.limiter.ratio 	= 5;
	//  this.limiter.attack 	= 0.035; // in seconds
	//  this.limiter.release 	= 0.080;  // in seconds

	// CREATE DELAY
	this.toDelay 					= context.createGain();
	this.toDelay.gain.value 		= this.delayConfig.toDelay;

	this.delay 						= context.createDelay();
	this.delay.delayTime.value 		= this.delayConfig.time;

	this.delayFeedback 				= context.createGain();
	this.delayFeedback.gain.value 	= this.delayConfig.feedback;

	// CREATE WAVESHAPER
	this.waveshaper = context.createWaveShaper();
	this.waveshaper.oversample = this.waveshaperConfig.oversample;
	this.waveshaper.curve = lm_wsCurve(this.waveshaperConfig.curveAmt);

	// CREATE MASTER GAIN + PAN

	this.mstrGain		 				= context.createGain(); // create amplitude control
	this.mstrGain.gain.value 			= 1;
	this.panStereo 						= context.createStereoPanner();
	this.panStereo.pan.value 			= 0;

	/*  --------------- CONNECT AUDIO ROUTING --------------- */
		// fmVoice is connected waveshaper & toDelay.

		// AUX send delay
		this.toDelay.connect(this.delay);
		this.delay.connect(this.delayFeedback);
		this.delay.connect(this.waveshaper);
		this.delayFeedback.connect(this.delay);

		this.waveshaper.connect(this.mstrGain);

		// this.limiter.connect(this.mstrGain);

		this.mstrGain.connect(this.panStereo); 
		this.panStereo.connect(context.destination); // connect the context to DAC

	/*  --------------- AUDIO ROUTING END --------------- */


	this.updateOutputParameters = function() {

			this.toDelay.gain.value				= this.delayConfig.toDelay;
			this.delay.delayTime.value			= this.delayConfig.time;
			this.delayFeedback.gain.value		= this.delayConfig.feedback;

			this.waveshaper.curve				= lm_wsCurve(this.waveshaperConfig.curveAmt);
	}
};

var fmOut = new synthOutput();

function fmPlay(){	// play a synth voice
	var newVoice = new fmVoice();
	newVoice.ampEnv();
};

function osc_mapFmParameters (arg) {

// see arg[X] at each variable, to figure out how to control it via OSC

	lm_fmOscMod.freq 	= arg[2] * 40;
	lm_fmOscMod.gain 	= (Math.pow((arg[3]*12), 3.6));
	
	// scale 0. 1. -> 0 3, round to convert FLOAT -> INT and lookup in lm_osc object
	lm_fmOscMod.type 	= lm_osc[Math.round(lmUtil_scale(arg[ 4 ], [0., 1.], [0, 3]))];

	lm_fmOscCar.freq 	= (arg[5] * 1000) + 200;
	lm_fmOscCar.type	= lm_osc[Math.round(lmUtil_scale(arg[ 6 ], [0., 1.], [0, 3]))];

	lm_fmFiltMain.freq	= Math.pow((arg[ 7 ]*10), 4.3)+40; // exponential range 40 Hz -> ~20kHz
	lm_fmFiltMain.gain  = 1; // -100 -> 100 
	lm_fmFiltMain.type	= lm_filters[Math.round(lmUtil_scale(arg[ 8 ], [0., 1.], [0, 7]))];
	lm_fmFiltMain.Q		= arg[9] + 0.5; // move into range 0.5 -> 1.5

	lm_fmAmpEnv.attack 	= (Math.pow((arg[10]*15), 2.4)*0.001)+0.005; // in seconds	
	lm_fmAmpEnv.decay	= (Math.pow((arg[11]*15), 2.8)*0.001)+0.005; // in seconds
}

function osc_mapOutputParameters (arg) {
	fmOut.delayConfig.toDelay  	= arg[2];

						 		 	  	  // scale 0. 1. -> 0 16, lookup noteval, convert noteval to ms in relation 
										  // to globalTempo
	fmOut.delayConfig.time 	 	= lmUtil_notevalToS(lmUtil_lookupNoteval
										[Math.round(lmUtil_scale(arg[ 3 ], [0., 1.], [0, 16]))], globalTempo);

	fmOut.delayConfig.feedback 	= lmUtil_scale(arg[ 4 ], [0., 1.], [0, 0.98]);
	fmOut.delayConfig.freq 		= arg[5] * 500; // not in use
	fmOut.delayConfig.width		= arg[6] * 1;	 // note in use

	fmOut.waveshaperConfig.curveAmt = Math.pow((arg[ 7 ]*5), 2.8);
	
	fmOut.panStereo.pan.value 	= (arg[8] - 0.5) * 2; // map to -1. to 1.
	fmOut.mstrGain.gain.value 	= arg[9];

	fmOut.updateOutputParameters();
}

function lm_wsCurve(amount) {
// Waveshaper curve - try out with different shapes
// http://kevincennis.github.io/transfergraph/
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

		var k = typeof amount === 'number' ? amount : 50,
			n_samples = context.sampleRate,
			curve = new Float32Array(n_samples),
			i = 0,
			x;

		for ( ; i < n_samples; ++i ) {
			x = i * 2 / n_samples - 1;
			curve[i] = (Math.PI + k) * x / (Math.PI + k * Math.abs(x));
		}
	return curve;
	
};