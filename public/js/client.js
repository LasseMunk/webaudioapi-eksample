
var socket = io().connect();	
	socket.on('message', oscMessage); 	

function oscMessage(data) {	  			
	if (data.address == '/synthParams'){			 
		osc_mapFmParameters(data.args);
		trigVoice.play();
	}
}

function osc_mapFmParameters (arg) {

	/*
	0: mod freq
	1: mod gain
	2: car freq
	3: car gain
	4: env att
	5: env dec
	6: pan
	7: gain multiplier	 
	*/

	fm_osc_modulator_freq 	= arg[0] * 40;
	fm_osc_modulator_gain 	= arg[1] * 1000;
	fm_osc_carrier_freq 	= (arg[2] * 1000) + 200;
	fm_osc_carrier_gain 	= arg[3];
	fm_env_attack 			= arg[4] + 0.005;	// in seconds
	fm_env_decay 			= arg[5] + 0.001; 	// in seconds
	fm_pan 					= (arg[6] - 0.5) * 2; // map to -1. to 1.
	fm_mstrGain 			= arg[7];
}