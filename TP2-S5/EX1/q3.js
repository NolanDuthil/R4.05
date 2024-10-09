const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let masses = [];
let springs = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 10; i++){
        createCircle(Math.random() * windowWidth, Math.random()* windowHeight, Math.random() * 100, Math.random() * 10)
    }
}

function createCircle(centerX, centerY, radius, segments){
    let c0 = masses.length;
    for(let i=0; i<segments; i++){
        let angle = i * (2.0 * Math.PI / segments);
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        masses.push(new Mass(x, y));
    }

    let c1 = masses.length

    for (let i = c0; i < c1; i++)
        for (let j = i + 1; j < c1 ; j++)
            springs.push(new Spring(masses[i], masses[j]));
}

function draw() {
    background(255);
 
    for(let mass of masses){
        mass.updatePosition();
        mass.display();
        mass.checkCollisionWithBox(width/2 - 100, height - 200, 200, 200)
    }

    for(let spring of springs){
        spring.applyConstraint();
        spring.display();
    }
}