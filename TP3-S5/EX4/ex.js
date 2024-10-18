import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

THREE.Cache.enabled = true;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e0e);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

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
camera.position.set(0, 20, 40);
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

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

// Particule
export default class Particule {
    constructor(_pos, _velocity, _geom) {
        this.material = new THREE.MeshBasicMaterial({
            map: sprite,
            depthTest: false,
            color: 0x000000,
            transparent: true,
            opacity: 0.2,
            alphaTest: 0.05,});

        this.mesh = new THREE.Mesh(_geom, this.material);
        let size = .3;
        this.mesh.scale.set(size, size, size);
        this.mesh.position.set(_pos.x, _pos.y, _pos.z);

        this.velocity = _velocity.clone();
        this.alpha = 255;
    }


    update(dt) {
        this.mesh.position.add(this.velocity);
        this.alpha -= 5;
        this.material.opacity = this.alpha / 255.0;
    }


    finished() {
        return this.alpha <= 0;
    }
}

function spawnRandomParticule(pos) {
    let speedFactor = 0.1
    let vel = new THREE.Vector3(
        speedFactor * (rand(-1, 1)),
        speedFactor * (rand(0, 5)),
        speedFactor * (rand(-1, 1))
    );


    let particule = new Particule(pos, vel, sphereGeometry);
    return particule;
}

const sphereGeometry = new THREE.SphereGeometry();
let emitterPos = new THREE.Vector3(0, 0, 0);

let particules = [];

let sprite = new THREE.TextureLoader().load('spark1.png');

let clock = new THREE.Clock();

function rand(min, max) {
    return min + Math.random() * (max - min);
}

// Main loop
gsap.ticker.add(() => {

    let deltaTime = clock.getDelta();

    for (let i = 0; i < 20; i++) {
        let particule = spawnRandomParticule(emitterPos);
        scene.add(particule.mesh);
        particules.push(particule);
    }

    for (let i = particules.length - 1; i >= 0; i--) {
        particules[i].update(deltaTime);
        if (particules[i].finished()) {
            scene.remove(particules[i].mesh);
            particules.splice(i, 1);
        }
    }

    stats.update();
    renderer.render(scene, camera);
    controls.update();
});
