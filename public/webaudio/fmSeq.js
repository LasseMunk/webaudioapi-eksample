var fmSeq = function() {
    var playIndex = 0; // index is incremented as a fm-voice index

/* ----- IDEAS

- Midi note arrays which can be changed from MAX over OSC.
- Midi to frequency conversion
- Time engine
- Accelerameter data from phone to controle synth. 
- Parse data from the sequencer to the synth
- Address individual phones using their socket.io IDs.

------- */


        this.play = function() {
            
            fmVoices[playIndex].ampEnv();               // trigger the current voice
            playIndex = (playIndex + 1) % fmNumVoices;  // cycle to next voice, wrap around the number of
                                                        // initaited voices
            
            };
    };

trigVoice = new fmSeq(); // initiate a sequencer

