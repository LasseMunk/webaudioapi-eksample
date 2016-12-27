
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
