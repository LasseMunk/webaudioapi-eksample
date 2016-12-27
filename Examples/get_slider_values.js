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