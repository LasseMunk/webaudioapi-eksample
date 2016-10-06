// animatinons with p5.js

var socket; 
var mX = 0;
var mY = 0;

var bubble = {
      x: 10,
      y: 10,
  
      lort: function() {
          stroke(255,0,0);
          strokeWeight(2);
          noFill();
          ellipse(this.x, this.y, 20, 20);
          },
      
      move: function() {
          this.x = this.x + (random(0, 1) );
          this.y = this.y + (random(0, 1) );
          
          if(this.x < 0 || this.x > width)  this.x = 0;
          if(this.y < 0 || this.y > height) this.y = 0;
          }
        }



function mouseDragged() {

  if(mouseX != mX || mouseY != mY) {
    // console.log(mouseX + ',' + mouseY);
    
    mX = mouseX;
    mY = mouseY;

    ellipse(mouseX, mouseY, 40, 40);  

    var data = {
      x: mouseX,
      y: mouseY
    }

    socket.emit('mouse', data);   // send data via socket.io to server
                                  // need 'name' and content (data) of message when sending
  }

  
}

function setup() {
  createCanvas(400, 200);

  socket = io.connect('http://localhost:3000'); //add IP-adress here if you are on the web
}

function draw() {
  background(255);

  bubble.lort();
  bubble.move();
  
  mouseDragged();
}