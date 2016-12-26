
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
		fmPlay();
	}
	
	if (data.args[1] == 'synthParams'){		 
		osc_mapFmParameters(data.args); // function is found in fmVoice.js
  	}
    if (data.args[1] == 'outputParams'){		 
		osc_mapOutputParameters(data.args); // function is found in fmVoice.js
  	}	
}