// Convert from range A --> B, to range X --> Y (similar to SCALE object in MAX/MSP)
// thanks http://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges/14224813#14224813
// example: lm_scale(inputValue, [ 300.77, 559.22 ], [ 1, 10 ] );
function lmUtil_scale( value, r1, r2 ) { 
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

// MIDI
// thanks http://jeremywentworth.com/projects/webkitsynth/js/webkitSynth.js

function lmUtil_midiToFreq(v){ return 440 * Math.pow(2,((v-69)/12)); }                      
function lmUtil_freqToMidi(v){ return Math.round(69 + 12*Math.log(v/440)/Math.log(2)); }