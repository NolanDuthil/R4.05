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
    gravity: new CANNON.Vec3(0, -9.82, 0),
})

// Create a box body
const size = 5
const halfExtents = new CANNON.Vec3(size / 2, size / 2, size / 2)
const boxShape = new CANNON.Box(halfExtents)
const boxBody = new CANNON.Body({ mass: 1, shape: boxShape })
boxBody.position.set(0, 10, 0)
world.addBody(boxBody)

// Create a static plane for the ground
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
world.addBody(groundBody)

// Create walls around the plane
const wallThickness = 1;
const wallHeight = 100;
const wallShape = new CANNON.Box(new CANNON.Vec3(wallThickness, wallHeight, 50));

// Left wall
const leftWallBody = new CANNON.Body({ mass: 0, shape: wallShape });
leftWallBody.position.set(-50, wallHeight / 2, 0);
world.addBody(leftWallBody);

// Right wall
const rightWallBody = new CANNON.Body({ mass: 0, shape: wallShape });
rightWallBody.position.set(50, wallHeight / 2, 0);
world.addBody(rightWallBody);

// Front wall
const frontWallBody = new CANNON.Body({ mass: 0, shape: wallShape });
frontWallBody.position.set(0, wallHeight / 2, 50);
frontWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
world.addBody(frontWallBody);

// Back wall
const backWallBody = new CANNON.Body({ mass: 0, shape: wallShape });
backWallBody.position.set(0, wallHeight / 2, -50);
backWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0);
world.addBody(backWallBody);

// Roof
const roofBody = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(50, wallThickness, 50)) });
roofBody.position.set(0, wallHeight + wallThickness / 2, 0);
world.addBody(roofBody);

// Create a box mesh
const geometry = new THREE.BoxGeometry(size, size , size);
const material = new THREE.MeshNormalMaterial();
const BoxMesh = new THREE.Mesh(geometry, material);
scene.add(BoxMesh);

// Animate function
function animate() {
    requestAnimationFrame(animate);

    world.step(2 / 60);

    BoxMesh.position.copy(boxBody.position);
    BoxMesh.quaternion.copy(boxBody.quaternion);

    renderer.render(scene, camera);
}
animate();

// Add event listener for spacebar
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const impulse = new CANNON.Vec3(
            (Math.random() - 0.5) * 2,10,0
        );
        
        boxBody.applyImpulse(impulse, boxBody.position);
    }
});

let clock = new THREE.Clock();

// Main loop
gsap.ticker.add(() => {

    stats.update();
    renderer.render(scene, camera);
    controls.update();
});
