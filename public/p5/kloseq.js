var p5_strokeAmount = 240;
var p5_isPlaying = 0;

function setup() {

	// createCanvas must be the first statement
  createCanvas(innerWidth, innerHeight);  
  stroke(p5_strokeAmount);     // Set line drawing color to white
  frameRate(30);
}

function draw() {

  //
  if(p5_isPlaying == 1) {
    p5_isPlaying = 0;
    p5_strokeAmount = 0;
    
  }
if (p5_strokeAmount <= 240) {
  updateStroke();
}
  noStroke();
  fill(p5_strokeAmount);
  translate(100, 100); 
  rotate(radians(45));
  rect(0, 0, 50, 50);

}

function updateStroke() {
    p5_strokeAmount = p5_strokeAmount + 20;
    return p5_strokeAmount;
}