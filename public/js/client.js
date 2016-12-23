
var socket = io().connect();	
	socket.on('message', oscMessage); 	

function oscMessage(data) {	 
    /*

    args[0]:
    0:      send to all
    1 -> :  send to specific index

    args[1]:
        function:
            - play
            - synthParams

    */
	if (data.args[1] == 'play'){			 
		trigVoice.play();	
		console.log('play');
	}
	
	if (data.args[1] == 'synthParams'){		 
		osc_mapFmParameters(data.args);
		console.log('oscParams');
		//console.log(data.args);
  	}	
}



function osc_mapFmParameters (arg) {

	/*
	2: mod freq
	3: mod gain
	4: car freq
	5: car gain
	6: env att
	7: env dec
	8: pan
	9: gain multiplier	 
	*/

	fm_osc_modulator_freq 	= arg[2] * 40;
	fm_osc_modulator_gain 	= arg[3] * 1000;
	fm_osc_carrier_freq 	= (arg[4] * 1000) + 200;
	fm_osc_carrier_gain 	= arg[5];
	fm_env_attack 			= arg[6] + 0.005;	// in seconds
	fm_env_decay 			= arg[7] + 0.001; 	// in seconds
	fm_pan 					= (arg[8] - 0.5) * 2; // map to -1. to 1.
	fm_mstrGain 			= arg[9];
}