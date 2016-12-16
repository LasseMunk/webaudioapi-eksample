var fmSeq = function() {
    var playIndex = 0; // index is incremented as a fm-voice index

        this.play = function() {
            
            fmVoices[playIndex].ampEnv();
            console.log(playIndex);
            playIndex = (playIndex + 1) % fmNumVoices;
            
            };

    //play();
    };

trigVoice = new fmSeq(); // initiate a sequencer

