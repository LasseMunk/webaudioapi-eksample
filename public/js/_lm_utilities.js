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


// TEMPO
    // 17 possible values     
    var lmUtil_lookupNoteval = ['1nd','1n','1nt','2nd','2n','2nt','4nd','4nt','8nd','8n','8nt', 
                                '16nd','16n','16nt','32nd','32n','32nt'];

function lmUtil_notevalToS(Xn, tempo) { 
   // Calculate notevalue to seconds in relation to current tempo
   // useful for e.g. setting delay values
   // similar to MAX's [translate notevalues ms] / 1000
   
    var result;
    var oneBeatInMs = 60000/tempo; // 1 beat in ms

    switch (Xn) {       
        case '1nd':
            result = oneBeatInMs * 6;
            break;
        case '1n':
            result = oneBeatInMs * 4;
            break;
        case '1nt':
            result = oneBeatInMs * 2.666667;
            break;
        case '2nd':
            result = oneBeatInMs * 3;
            break;
        case '2n':
            result = oneBeatInMs * 2;
            break;
        case '2nt':
            result = oneBeatInMs * 1.333333;
            break;
        case '4nd':
            result = oneBeatInMs * 1.5;
            break;
        case '4n':
            result = oneBeatInMs;
            break;
        case '4nt':
            result = oneBeatInMs * 0.666667;
            break;
        case '8nd':
            result = oneBeatInMs * 0.75;
            break;
        case '8n':
            result = oneBeatInMs * 0.5;
            break;
        case '8nt':
            result = oneBeatInMs * 0.333;
            break;
        case '16nd':
            result = oneBeatInMs * 0.375;
            break;
        case '16n':
            result = oneBeatInMs * 0.25;
            break;
       case '16nt':
            result = oneBeatInMs * 0.166;
            break;
       case '32nd':
            result = oneBeatInMs * 0.1875;
            break;
       case '32n':
            result = oneBeatInMs * 0.125;
            break;
       case '32nt':
            result = oneBeatInMs * 0.083333;
            break;
        default:
            result = 'no valid notevalue input';
    };   
    return (result / 1000);   // convert result to seconds
};
