import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Fog
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

// Light
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
scene.add(light);
const dlHelper = new THREE.DirectionalLightHelper(light);
scene.add(dlHelper);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
const camHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(camHelper);

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xcbcbcb,
    }));
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);

// Grid helper
const gridHelper = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(10, 10, 20);
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// Resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Stats
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// GUI
const gui = new GUI();
const params = {
    showHelpers: true
}
gui.add(params, "showHelpers");

// Original code from https://tympanus.net/codrops/2021/10/04/creating-3d-characters-in-three-js/
const random = (min, max, float = false) => {
    const val = Math.random() * (max - min) + min;
    if (float) return val;
    return Math.floor(val)
}

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

class Bullet extends THREE.Group {
    constructor (x,y,z,orientation) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
        this.orientation = orientation;
        this.life = 200;

        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(.2,32,16),
            new THREE.MeshLambertMaterial({color:"#ff0000"})
        );
        this.bullet.castShadow = true;
        this.add(this.bullet);
        this.position.set(x,y,z)
    }

    isAlive(){
        return this.life > 0;
    }

    update(){
        this.life--;
        const speed = 1.1;
        this.position.x += speed * Math.sin(this.orientation)
        this.position.z += speed * Math.cos(this.orientation)
    }

}

class Figure {
    constructor(params) {
        this.params = {
            x: 0,
            y: 1.4,
            z: 0,
            ry: 0,
            armRotation: 0,
            headRotation: 0,
            leftEyeScale: 0
        };

        // Create group and add to scene
        this.group = new THREE.Group();
        scene.add(this.group);

        // Position according to params
        this.group.position.x = this.params.x;
        this.group.position.y = this.params.y;
        this.group.position.z = this.params.z;

        // Material
        this.headHue = random(0, 360);
        this.bodyHue = random(0, 360);
        this.headLightness = random(40, 65);
        this.headMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)` });
        this.bodyMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.bodyHue}, 85%, 50%)` });
        this.arms = []
        this.legs = []
    }

    createBody() {
        this.body = new THREE.Group();
        const geometry = new THREE.BoxGeometry(1, 1.5, 1);
        const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial);
        bodyMain.castShadow = true;

        this.body.add(bodyMain);
        this.group.add(this.body);

        this.createLegs();
    }

    createHead() {
        // Create a new group for the head
        this.head = new THREE.Group();

        // Create the main cube of the head and add to the group
        const geometry = new THREE.SphereGeometry(.85, 30, 15);
        const headMain = new THREE.Mesh(geometry, this.headMaterial);
        headMain.castShadow = true;

        this.head.add(headMain);

        // Add the head group to the figure
        this.group.add(this.head);

        // Position the head group
        this.head.position.y = 1.65;

        // Add the eyes
        this.createEyes();


        const antennaGeometry = new THREE.CylinderGeometry(.03, .03, .8, 8)
        const antenna1 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        antenna1.position.set(-.55, .8, 0);
        antenna1.rotation.z = Math.PI / 6;
        antenna1.castShadow = true;
        this.head.add(antenna1);

        const antenna2 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        antenna2.position.set(.55, .8, 0);
        antenna2.rotation.z = Math.PI / -6;
        antenna2.castShadow = true;
        this.head.add(antenna2);

    }



    createArms() {
        const height = 0.85;

        for (let i = 0; i < 2; i++) {
            const armGroup = new THREE.Group();
            const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
            const arm = new THREE.Mesh(geometry, this.headMaterial);
            const m = i % 2 === 0 ? 1 : -1;
            arm.castShadow = true;

            // Add arm to group
            armGroup.add(arm);

            // Add group to figure
            this.body.add(armGroup);

            // Translate the arm by half the height
            arm.position.y = height * -0.5;

            // Position the arm relative to the figure
            armGroup.position.x = m * 0.8;
            armGroup.position.y = 0.6;

            // Rotate the arm
            armGroup.rotation.z = degreesToRadians(30 * m);

            // Push to the array
            this.arms.push(armGroup);
        }
    }

    createEyes() {
        const eyes = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.15, 12, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(geometry, material);
            const m = i % 2 === 0 ? 1 : -1;

            eyes.add(eye);
            eye.position.x = 0.36 * m;
            if (m == -1) this.lefteye = eye;
        }

        this.head.add(eyes);

        eyes.position.y = -0.1;
        eyes.position.z = 0.7;
    }

    createLegs() {
        const legsGroup = new THREE.Group();
        const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25);

        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(geometry, this.headMaterial);
            const m = i % 2 === 0 ? 1 : -1;

            legsGroup.add(leg);
            leg.position.x = m * 0.22;
            this.legs.push(leg);
        }

        this.group.add(legsGroup);
        legsGroup.position.y = -1.15;

        this.body.add(legsGroup);

    }

    update() {
        this.group.rotation.y = this.params.ry;
        this.group.position.y = this.params.y;
        this.group.position.z = this.params.z;
        this.group.position.x = this.params.x;
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            arm.rotation.z = this.params.armRotation * m;
            arm.rotation.x = this.params.walkRotation * -m;
        });
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            leg.rotation.x = this.params.walkRotation * -m;
        });
        this.head.rotation.z = this.params.headRotation;
        this.lefteye.scale.x = this.lefteye.scale.y = this.lefteye.scale.z = this.params.leftEyeScale;
        // update turn
        figure.params.ry += rySpeed;
        rySpeed *= .93;
        // update walk
        figure.params.x = figure.params.x + walkSpeed * Math.sin(figure.params.ry);
        figure.params.z = figure.params.z + walkSpeed * Math.cos(figure.params.ry);
        walkSpeed *= .97;
        // bullet
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].isAlive()) {
                bullets[i].update();
            }
            else {
                scene.remove(bullets[i]);
                bullets.slice(i, 1);
            }
        }
    }

    init() {
        this.createBody();
        this.createHead();
        this.createArms();
    }
}

const figure = new Figure();
figure.init();

gsap.registerPlugin(CustomEase);

let rySpeed = 0;
let walkSpeed = 0;
let leftKeyIsDown = false;
let rightKeyIsDown = false;
let upKeyIsDown = false;

let jumpTimeline = gsap.timeline();
let WalkTimeline = gsap.timeline();

let bullets = [];

document.addEventListener('keydown', (event) => {
    if ((event.key == ' ') && (jumpTimeline.isActive() == false)) {
        jumpTimeline.to(figure.params, {
            y: 3,
            armRotation: degreesToRadians(90),
            repeat: 1,
            yoyo: true,
            duration: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0.479,-0.727 0.332,0.246 0.601,0.663 0.743,0.884 0.818,1.001 1,1 "),
        })
    }
    if (event.key == 'q') {
        rySpeed += 0.05
        leftKeyIsDown = true
    }

    if (event.key == 'd') {
        rySpeed -= 0.05
        rightKeyIsDown = true
    }
    if (event.key == 'z') {
        walkSpeed += .1;
        upKeyIsDown = true

    }
    if (event.key == 'f') {
        let bullet = new Bullet(figure.params.x, figure.params.y, figure.params.z, figure.params.ry);
        scene.add(bullet);
        bullets.push(bullet);
    }


});

document.addEventListener('keyup', (event) => {

    if (event.key == 'q') {
        leftKeyIsDown = false
    }

    if (event.key == 'd') {
        rightKeyIsDown = false
    }
    if (event.key == 'z') {
        upKeyIsDown = false

    }

});

WalkTimeline.to(figure.params, {
    walkRotation: degreesToRadians(45),
    repeat: 1,
    yoyo: true,
    duration: .25,
},)
WalkTimeline.to(figure.params, {
    walkRotation: degreesToRadians(-45),
    repeat: 1,
    yoyo: true,
    duration: .25,
},)

let idleTimeline = gsap.timeline();
idleTimeline.to(figure.params, {
    headRotation: .25,
    repeat: 1,
    yoyo: true,
    duration: .75,
    delay: 2.5,
    ease: "back.out"
});

idleTimeline.to(figure.params, {
    leftEyeScale: 1.25,
    repeat: 1,
    yoyo: true,
    duration: 1,
    ease: "elastic.in"
}, ">2.2")


// Main loop
gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;

    if (leftKeyIsDown) {
        rySpeed += .001;
    }
    if (rightKeyIsDown) {
        rySpeed += .001;
    }
    if (upKeyIsDown) {
        walkSpeed += .001;
    }
    if ((walkSpeed >= .001 || walkSpeed <= -.01) && !WalkTimeline.isActive()) {
        idleTimeline.pause(0);
        WalkTimeline.restart();
    }

    if ((!jumpTimeline.isActive()) && (!WalkTimeline.isActive()) && (!idleTimeline.isActive()) && (rySpeed < .01) && (walkSpeed < .01)) {
        idleTimeline.restart();
    }

    if ((idleTimeline.isActive() == false) && (jumpTimeline.isActive() == false)) {
        idleTimeline.restart();
    }
    figure.update();
    controls.update();
    stats.update();
    renderer.render(scene, camera);
});