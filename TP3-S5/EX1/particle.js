class Particle {

    constructor() {
      this.x = mouseX;
      this.y = mouseY;   
      this.vx = random(-1, 1);
      this.vy = random(-5, -1);
      this.alpha = 255;
    }
  
    finished() {
      return this.alpha < 0;
    }
  
    update() {
      let wind = random(-0.1, 5);
      this.x += this.vx + wind;
      this.y += this.vy;
      this.alpha -= 5;
    }
  
    show() {
      noStroke();
      //stroke(255);
      fill(255 - this.alpha, 105, 180, 255 ,this.alpha);
      ellipse(this.x, this.y, 16);
    }
  
  }