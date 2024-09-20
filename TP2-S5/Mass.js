class Mass {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector();
    }
    updatePosition() {
        this.velocity.y += gravity;
        this.velocity.mult(damping);
        this.velocity.limit(maxVel);
        this.position.x += this.velocity.x*deltaT;
        this.position.y += this.velocity.y*deltaT;
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
            this.velocity.y *= friction;
          }
          if (this.position.x > width) {
            this.position.x = width;
            this.velocity.x = 0;
            this.velocity.y *= friction;
          }
          if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.velocity.x *= friction;
          }
          if (this.position.y > height) {
            this.position.y = height;
            this.velocity.y = 0;
            this.velocity.x *= friction;
          }
    }
    display() {
        fill(0);
        circle(this.position.x, this.position.y, 10);
    }
 }

 class Spring {
    constructor(_m1, _m2) {
        this.m1 = _m1;
        this.m2 = _m2;
        this.restLength = dist(_m1.position.x, _m1.position.y,
            _m2.position.x, _m2.position.y);
    }
    applyConstraint() {
        let d = this.m2.position.copy();
        d.sub(this.m1.position);
        let m = (d.mag() - this.restLength)/this.restLength;
        d.mult(m * 2);
        d.mult(stiffness);
        d.mult(0.5);
        this.m1.velocity.add(d);
        this.m2.velocity.sub(d);
    }
    display() {
        line(this.m1.position.x, this.m1.position.y,
            this.m2.position.x, this.m2.position.y);
    }
 }
 
 