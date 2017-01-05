var kloSeqConf = {
    xSteps: 16,
    ySteps: 7,
    xOffset: 1,
    yOffset: 1,
    stepSpacing: 2,
    stepSize: 30,
    colorOn: [179, 106, 226],
    colorOff: [200, 203, 215],
    colorTime: [10, 10, 10]   
};

var kloSeqScale = [60, 63, 65, 68, 72, 74, 75];

var currentTime = 0;
var timeline = 0;
var stepArray = [];

function setup() {

  createCanvas(innerWidth, innerHeight);  // createCanvas must be the first statement
  stroke(255);
  frameRate(30);
  rectMode(CORNERS);
  
  kloSeqConf.stepSize = (innerWidth / kloSeqConf.xSteps) - kloSeqConf.stepSpacing;
  
  for(i = 0; i < kloSeqConf.xSteps; i++) {
      stepArray[i] = []; // create nested array

      for(j = 0; j < kloSeqConf.ySteps; j++) {
          stepArray[i][j] = new Step(i, j);
      };
  };
};

function draw() {

  currentTime = (currentTime +1) % 30;
    if(currentTime === 0) {
        timeline = (timeline + 1) % kloSeqConf.xSteps;
        
        for(i = 0; i < kloSeqConf.xSteps; i++) {
            for(j = 0; j < kloSeqConf.ySteps; j++) {
                stepArray[i][j].step = timeline;
                stepArray[i][j].updateTimeline();

            };
        };   
    };

  //translate(100, 100); 
  //rotate(radians(45));

};

var Step = function(stepX, stepY) {
    
    this.active = 0;
    this.step = 0;
    this.indexX = stepX;
    this.indexY = stepY;
    this.thisX = (stepX * (kloSeqConf.stepSpacing+kloSeqConf.stepSize)) + kloSeqConf.xOffset;
    this.thisY = (stepY * (kloSeqConf.stepSpacing+kloSeqConf.stepSize)) + kloSeqConf.yOffset;
    this.thisXtwo = this.thisX + kloSeqConf.stepSize;
    this.thisYtwo = this.thisY + kloSeqConf.stepSize;
    

    this.updateTimeline = function() {
    
        if(this.step != this.indexX && this.active === 0) { // draw grey boxes pr. default
                fill(kloSeqConf.colorOff[0],kloSeqConf.colorOff[1], kloSeqConf.colorOff[2]);
                rect(this.thisX, this.thisY, this.thisXtwo, this.thisYtwo);  
                
        };
        
        if(this.step === this.indexX && this.active === 0) { // draw black timeline
                fill(kloSeqConf.colorTime[0],kloSeqConf.colorTime[1], kloSeqConf.colorTime[2]);
                rect(this.thisX, this.thisY, this.thisXtwo, this.thisYtwo);  
        };
        if(this.step === this.indexX && this.active === 1) {
            
            lm_fmOscCar.freq = lmUtil_midiToFreq(kloSeqScale[6-this.indexY]);
                
            fmPlay();
        }
    };

    this.activeStateMachine = function(_x, _y) {
        if(_x >= this.thisX && _x <= this.thisXtwo && _y >= this.thisY && _y <= this.thisYtwo) {
            if(this.active === 0) {
                this.active = 1;    
                
                fill(kloSeqConf.colorOn[0],kloSeqConf.colorOn[1], kloSeqConf.colorOn[2]);
                rect(this.thisX, this.thisY, this.thisXtwo, this.thisYtwo);

            } else {
                this.active = 0;

                fill(kloSeqConf.colorOff[0],kloSeqConf.colorOff[1], kloSeqConf.colorOff[2]);
                rect(this.thisX, this.thisY, this.thisXtwo, this.thisYtwo);  
            };
        };   
    this.updateTimeline();
    };
}

/*
function mousePressed() {
        for(i = 0; i < kloSeqConf.xSteps; i++) {
            for(j = 0; j < kloSeqConf.ySteps; j++) {
                stepArray[i][j].activeStateMachine(mouseX, mouseY);
                document.getElementById("peter").innerHTML = ""+mouseX+","+mouseY;
            };
        };   

// return false;    
}; */

function touchEnded() {
    document.getElementById("debug").innerHTML = mouseX;
        for(i = 0; i < kloSeqConf.xSteps; i++) {
            for(j = 0; j < kloSeqConf.ySteps; j++) {
                stepArray[i][j].activeStateMachine(mouseX, mouseY);
                
            };
        };   
return false;    
}; 

