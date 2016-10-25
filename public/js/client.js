

var socket = io().connect();
socket.on('message', oscMessage); 	// if there is a message called 'message', call function
													// oscMessage
function oscMessage(data) {	  		// the content of the 'oscMessage' message, is logged	
	ampEnv();
	console.log("ampenv");		 
}
