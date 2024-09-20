const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let masses = [];
let springs = [];

function setup() {
    createCanvas(windowWidth, windowHeight)
    // Square
    let m1Square = new Mass(200, 200);
    let m2Square = new Mass(200, 300);
    let m3Square = new Mass(300, 200);
    let m4Square = new Mass(300, 300);
    masses.push(m1Square);
    masses.push(m2Square);
    masses.push(m3Square);
    masses.push(m4Square);
    springs.push(new Spring(m1Square, m2Square));
    springs.push(new Spring(m3Square, m4Square));
    springs.push(new Spring(m1Square, m3Square));
    springs.push(new Spring(m2Square, m4Square));

    // Sphere

    let radius = 100;
    let segments = 20;
    let centerX = Math.random()*windowWidth;
    let centerY = Math.random()*windowHeight;

    for (let i = 0; i< segments; i++){
        let angle = i * (2.0*Math.PI/segments);
        let x = centerX + radius*Math.cos(angle);
        let y = centerY + radius*Math.sin(angle);

        masses.push(new Mass(x,y));

    }

    for (let i = 0; i< segments; i++){
        for (let j = i + 1;j<segments;j++){
            springs.push(new Spring(masses[masses.lenght - segments + i
            ], masses[masses.lenght-segments+j]));
        }
    }
}

function mousePressed(){
    for(let mass of masses){
        let d = mass.position.copy();
        d.sub(createVector(mouseX,mouseY));
        d.normalize();
        d.mult(100);
        mass.velocity.sub(d);
    }
}

function draw() {
    background(255);

    for (let mass of masses) {
        mass.updatePosition();
        mass.display();
    }

    for (let spring of springs) {
        spring.applyConstraint();
        spring.display();
    }
}