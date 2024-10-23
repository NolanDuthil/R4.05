import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from './cannon-es.js';

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

// CANNON

// Setup our physics world
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

// Create a sphere body
const radius = 1 // m
const sphereBody = new CANNON.Body({
    mass: 5, // kg
    shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(0, 10, 0) // m
world.addBody(sphereBody)

// Create a sphere body
const sphereBody2 = new CANNON.Body({
    mass: 5, // kg
    shape: new CANNON.Sphere(radius),
})
sphereBody2.position.set(0, 15, 0) // m
world.addBody(sphereBody2)

// Create a static plane for the ground
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
    shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

const geometry = new THREE.SphereGeometry(radius)
const material = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(geometry, material)
scene.add(sphereMesh)

const geometry2 = new THREE.SphereGeometry(radius)
const material2 = new THREE.MeshNormalMaterial()
const sphereMesh2 = new THREE.Mesh(geometry2, material2)
scene.add(sphereMesh2)

// Animate function
function animate() {
    requestAnimationFrame(animate);

    // Step the physics world
    world.step(2 / 60);

    // Copy coordinates from Cannon.js to Three.js
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    // Copy coordinates from Cannon.js to Three.js
    sphereMesh2.position.copy(sphereBody2.position);
    sphereMesh2.quaternion.copy(sphereBody2.quaternion);

    // Render the scene
    renderer.render(scene, camera);
}
animate();

// Add event listener for spacebar
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const impulse = new CANNON.Vec3(
            (Math.random() - 0.5) * 2,50,0
        );
        
        sphereBody.applyImpulse(impulse, sphereBody.position);
        sphereBody2.applyImpulse(impulse, sphereBody2.position);
    }
});

let clock = new THREE.Clock();

// Main loop
gsap.ticker.add(() => {

    stats.update();
    renderer.render(scene, camera);
    controls.update();
});
