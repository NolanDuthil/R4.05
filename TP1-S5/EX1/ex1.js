import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Fog
// scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

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
camera.position.set();
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
    constructor(x, y, z, orientation) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
        this.orientation = orientation;
        this.life = 200;

        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(.2, 32, 16),
            new THREE.MeshLambertMaterial({ color: "#ff0000" })
        );
        this.bullet.castShadow = true;
        this.add(this.bullet);
        this.position.set(x, y, z)
    }

    isAlive() {
        return this.life > 0;
    }

    update() {
        this.life--;
        const speed = 1.1;
        this.position.x += speed * Math.sin(this.orientation)
        this.position.z += speed * Math.cos(this.orientation)
    }

}

class Figure extends THREE.Group {
    constructor(params) {
        super();
        this.params = {
            x: 0,
            y: 0,
            z: 0,
            ry: 0,
        }

        this.position.x = this.params.x;
        this.position.y = this.params.y;
        this.position.z = this.params.z;
        this.position.y = this.params.ry

        // model
        var self = this;
        const loader = new GLTFLoader();
        loader.load('./RobotExpressive.glb', function (gltf) {

            self.add(gltf.scene);
            self.loadAnimations(gltf.scene, gltf.animations);

        }, undefined, function (e) {

            console.error(e);

        });

    }



    loadAnimations(model, animations) {
        this.mixer = new THREE.AnimationMixer(model);

        this.states = ["Idle", "Running", "Jump", "ThumbsUp"];
        this.actions = {};

        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            if (this.states.includes(clip.name)) {
                const action = this.mixer.clipAction(clip);
                this.actions[clip.name] = action;

                if (clip.name == "Jump" || clip.name == "ThumbsUp") {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                }
            }


        }
        this.state = "Idle"
        this.actions[this.state].play();
    }

    fadeToAction(name, duration) {

        if (!this.actions) return;

        if (name === this.state ) return;

        console.log(this.state, name);

        this.actions[this.state].fadeOut(duration);

        this.actions[name].reset()
        .fadeIn(duration)
        .play();

        this.state = name;
    }

    update(dt) {
        this.position.y = this.params.y;
        this.position.x = this.params.x;
        this.position.z = this.params.z;
        this.rotation.y = this.params.ry;

        if (this.mixer) {
            this.mixer.update(dt);
        }

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
}

const figure = new Figure();
scene.add(figure);

let jumpTimeline = gsap.timeline();

gsap.registerPlugin(CustomEase);

let rySpeed = 0;
let walkSpeed = 0;
let leftKeyIsDown = false;
let rightKeyIsDown = false;
let upKeyIsDown = false;

let bullets = [];

document.addEventListener('keydown', (event) => {
    if ((event.key == ' ') && (jumpTimeline.isActive() == false)) {
        jumpTimeline.to(figure.params, {
            y: 1,
            repeat: 1,
            duration: 0.4,
            yoyo: true,
        })}
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
        figure.fadeToAction("ThumbsUp", 0.25);
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

let clock = new THREE.Clock();


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
        rySpeed -= .001;
    }
    if (upKeyIsDown) {
        walkSpeed += .02;
        figure.fadeToAction("Running", 0.25)
    }

    if(jumpTimeline.isActive()){
        figure.fadeToAction("Jump", 0.25);
    }
    else if ((!jumpTimeline.isActive()) && (rySpeed < 0.01) && (walkSpeed < 0.01)) {
        figure.fadeToAction("Idle", 0.25);
    }

    figure.params.ry += rySpeed;
    rySpeed *= 0.93;
    figure.params.x += walkSpeed * Math.sin(figure.params.ry);
    figure.params.z += walkSpeed * Math.cos(figure.params.ry);
    walkSpeed *= .95;

    const localCameraPosition = new THREE.Vector3(0,5,-25);
    figure.localToWorld(localCameraPosition)
    camera.position.copy(localCameraPosition)

    camera.lookAt(new THREE.Vector3(figure.position.x, 5, figure.position.z,));

    camera.updateProjectionMatrix();

    let dt = clock.getDelta();

    figure.update(dt);
    stats.update();
    renderer.render(scene, camera);
});


