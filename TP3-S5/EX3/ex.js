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

// Particle
export default class Particule {
    constructor(_pos, _velocity, _vertices, _particleId) {
        this.index = _particleId;
        this.vertices = _vertices;
        this.vertices[this.index * 3] = _pos.x;
        this.vertices[this.index * 3 + 1] = _pos.y;
        this.vertices[this.index * 3 + 2] = _pos.z;

        this.velocity = _velocity.clone();
        this.alpha = 1.0;

    }

    update(dt) {
        this.vertices[this.index * 3] += this.velocity.x * dt;
        this.vertices[this.index * 3 + 1] += this.velocity.y * dt;
        this.vertices[this.index * 3 + 2] += this.velocity.z * dt;

        this.alpha -= 0.01;
    }

    finished() {
        return this.alpha <= 0;
    }
}

const sphereGeometry = new THREE.SphereGeometry();

let availableParticlesId = [];
let activeParticles = [];
let emitterPos = new THREE.Vector3(0, 0, 0);

let geometry = new THREE.BufferGeometry();
let vertices = [];

const N = 1050;

for (let i = 0; i < N; i++) {
    vertices.push(0, -10000, 0);
    availableParticlesId.push(i);
}

geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

let sprite = new THREE.TextureLoader().load('spark1.png');
let material = new THREE.PointsMaterial({
    size: 1,
    map: sprite,
    depthTest: false,
    color: 0xFF00FF,
    transparent: true,
    opacity: 0.2,
    alphaTest: 0.05,
    sizeAttenuation: true
});

scene.add(new THREE.Points(geometry, material));

let clock = new THREE.Clock();

// Main loop
gsap.ticker.add(() => {

    let deltaTime = clock.getDelta();


    let vertices = geometry.getAttribute('position').array;

    if (availableParticlesId.length > 10) {
        for (let i = 0; i < 10; i++) {
            let particuleId = availableParticlesId[0];
            let vel = new THREE.Vector3(
                (Math.random() * 2.0 - 1.0),
                (Math.random() * 4.0 + 1.0),
                (Math.random() * 2.0 - 1.0)
            );
            let p = new Particule(emitterPos, vel, vertices, particuleId);
            activeParticles.push(p);

            availableParticlesId.splice(0, 1);
        }
    }

    for (let i = activeParticles.length - 1; i >= 0; i--) {

        activeParticles[i].update(deltaTime);

        if (activeParticles[i].finished()) {
            availableParticlesId.push(activeParticles[i].index);
            activeParticles.splice(i, 1);
        }
    }

    geometry.getAttribute('position').needsUpdate = true;

    stats.update();
    renderer.render(scene, camera);
    controls.update();
});
