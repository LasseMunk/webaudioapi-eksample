var p5_strokeAmount = 0;

function setup() {

	// createCanvas must be the first statement
  createCanvas(innerWidth, innerHeight);  
  stroke(p5_strokeAmount);     // Set line drawing color to white
  frameRate(30);
}

function draw() {

  //  updateStroke()

    stroke(p5_strokeAmount);
    fill(p5_strokeAmount);

    ellipse(80, 80, 80, 80);

}

function updateStroke() {
    p5_strokeAmount = p5_strokeAmount + 20;
    p5_strokeAmount = p5_strokeAmount % 256;
 
    return p5_strokeAmount;
}