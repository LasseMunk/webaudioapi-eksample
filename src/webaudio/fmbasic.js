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
