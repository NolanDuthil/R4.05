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
    let m1 = new Mass(Math.random() * windowWidth, Math.random() * windowHeight);
    let m2 = new Mass(Math.random() * windowWidth, Math.random() * windowHeight);

    masses.push(m1);
    masses.push(m2);

    springs.push(new Spring(m1, m2));
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