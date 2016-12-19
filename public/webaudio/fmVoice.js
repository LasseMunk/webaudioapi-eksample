// Global scope
var context = new AudioContext(); // Create audio context
								  // webkit prefix is no longer needed nor recommended

/*  --------------- SLIDER VALUES --------------- */
var fm_osc_modulator_freq = 100;
var fm_osc_modulator_gain = 0;
var fm_osc_carrier_freq = 100;
var fm_osc_carrier_gain = 1;
var fm_env_attack = 0.005;
var fm_env_decay = 0.1;
var fm_pan = 0;
var fm_mstrGain = 1;

/*  Use index.html sliders for control

		document.getElementById("slider_modFreq").addEventListener('input', function () {		
																	// 'input' create a continous input detection
																	// alternative could be 'change'
			fm_osc_modulator_freq = this.value * 8; 
			
		});

		document.getElementById("slider_modGain").addEventListener('input', function () {		
			fm_osc_modulator_gain = this.value*1000; 
		});

		document.getElementById("osc_carrier_freq").addEventListener('input', function () { 	
			fm_osc_carrier_freq = (this.value*1000)+200; 
		});

		document.getElementById("mstrGain").addEventListener('input', function () { 	
			fm_mstrGain = this.value; 
		});

		document.getElementById("panStereo").addEventListener('input', function () { 	
			fm_pan = (this.value-0.5)*2; // pan range [-1., 1.]
		});

		document.getElementById("slider_ampAttack").addEventListener('input', function () { 	
			fm_env_attack = this.value; 
			fm_env_attack = parseFloat(fm_env_attack);
		});

		document.getElementById("slider_ampDecay").addEventListener('input', function () { 
			fm_env_decay = this.value; 
			fm_env_decay = parseFloat(fm_env_decay);
		});

		*/

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

	var now = context.currentTime;
	var attackPlusNow = 0;

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

	this.updateSynthParams = function() {

		this.osc_modulator.frequency.value = fm_osc_modulator_freq;
		this.osc_modulatorGain.gain.value =	fm_osc_modulator_gain;
		this.osc_carrier.frequency.value = fm_osc_carrier_freq;
		this.osc_carrierGain.gain.value = fm_osc_carrier_gain;
		this.panStereo = fm_pan;
		this.mstrGain.gain.value = fm_mstrGain;

	};

	this.ampEnv = function() {

			this.updateSynthParams();

			now = context.currentTime;
			//amp.attackPlusNow = parseFloat(amp.attackPlusNow);
			fm_env_attack = parseFloat(fm_env_attack);
			attackPlusNow = now + fm_env_attack;

			this.osc_carrierGain.gain.cancelScheduledValues(0);
			
			// Amplitude envelope
			this.osc_carrierGain.gain.setValueAtTime(0, now);
			this.osc_carrierGain.gain.setTargetAtTime(1, now, fm_env_attack);
			this.osc_carrierGain.gain.setTargetAtTime(0, attackPlusNow, fm_env_decay); 
			// target value, start time, ramp time

		}
};

// var newVoice = new fmVoice();

var fmNumVoices = 8; // how many voices to instantiate
var fmVoices = [];	 // array to fill with fm-voices

for(i = 0; i < fmNumVoices; i++) { 	// instantiate fm voices 
	fmVoices[i] = new fmVoice();
	};
