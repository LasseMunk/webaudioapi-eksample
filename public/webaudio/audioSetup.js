/*

var lm_initiate = new testClientSystem();
var touchEventlisten;

function testClientSystem (){
var isiOS = 1;

    // test if iOS, if it is, then wait until 'touchend', it it isn't then just initiate audio

    if(isiOS == 0) {
       initiateAudio(); 
       
    };
    if (isiOS == 1) {   
        touchEventlisten = new touchEventlistener();
    };
};

function touchEventlistener() {
    var hasBeenTouched = 1  ;

    document.body.addEventListener('touchend', function(e){
        // http://www.javascriptkit.com/javatutors/touchevents.shtml
            
        // initiate audio if it's the first touch
        if(hasBeenTouched == 0) {
            
            initiateAudio();        // important for making it work on iOS   
            hasBeenTouched = 1;     // only call touch event 1
            
       };
    }, false);
}

function deleteTouchEventListener() {   // delete the touchend listener after use, to avoid clicks in audio
    touchEventlisten = 'event listener deleted';
}

function initiateAudio() {
    
    globalTempo = 120; // BPM
   
    context = new AudioContext(); // Create audio context
								  // webkit prefix is no longer needed nor recommended
     console.log(context);
    // create empty buffer and play sample inside touchend event to enable iOS audio
    fmOut = new synthOutput();

    	// create empty buffer
	var buffer = myContext.createBuffer(1, 1, 22050);
	var source = myContext.createBufferSource();
	source.buffer = buffer;

	// connect to output (your speakers)
	source.connect(myContext.destination);

	// play the file
	source.noteOn(0);
    
};

*/