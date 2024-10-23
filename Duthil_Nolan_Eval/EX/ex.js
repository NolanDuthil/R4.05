// Ex de base avec comptage des score dans la console (pas réeussi a afficher le texte sur la scéne)

import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from './cannon-es.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

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

// Arrays to store cylinder bodies and meshes
const cylinderBodies = [];
const cylinderMeshes = [];

let score = 0;

// Function to create and add a cylinder to the world
function createCylinder(world, radius, height, position) {
    const cylinderShape = new CANNON.Cylinder(radius, radius, height, 16);
    const cylinderBody = new CANNON.Body({ mass: 1, shape: cylinderShape });
    cylinderBody.position.copy(position);

    // Set initial velocity to zero to prevent jumping
    cylinderBody.velocity.set(0, 0, 0);
    cylinderBody.angularVelocity.set(0, 0, 0);

    // Set restitution and friction to control bouncing and sliding
    cylinderBody.material = new CANNON.Material({
        friction: 0.5,
        restitution: 0.1
    });

    world.addBody(cylinderBody);
    cylinderBodies.push(cylinderBody);

    // Add collision event listener
    cylinderBody.addEventListener('collide', (event) => {
        if (event.body === groundBody && !cylinderBody.hasScored) {
            score++;
            cylinderBody.hasScored = true; // Mark the cylinder as having scored
            console.log(`Score: ${score - 17}`);
        }
    });
}

// Function to create and add a cylinder mesh to the scene
function createCylinderMesh(scene, radius, height, position) {
    const geometryCylinder = new THREE.CylinderGeometry(radius, radius, height, 16);
    const materialCylinder = new THREE.MeshNormalMaterial();
    const cylinderMesh = new THREE.Mesh(geometryCylinder, materialCylinder);
    cylinderMesh.position.copy(position);
    scene.add(cylinderMesh);
    cylinderMeshes.push(cylinderMesh);
}

// // New code for score display
// let scoreText = null;
// const fontLoader = new THREE.FontLoader();
// const myFont = "helvetiker_regular.typeface.json";
// const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

// function updateScoreText(score) {
//     if (scoreText) {
//         scene.remove(scoreText);
//     }
//     fontLoader.load(myFont, (font) => {
//         const textGeometry = new THREE.TextGeometry('Score: ' + score, {
//             font: font,
//             size: 1,
//             height: 0.2,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0.02,
//             bevelOffset: 0,
//             bevelSegments: 5
//         });
//         scoreText = new THREE.Mesh(textGeometry, textMaterial);
//         scoreText.position.set(0, 2, 0);
//         scene.add(scoreText);
//     });
// }

// // Initial score display
// updateScoreText(0);

// Create multiple cylinders and meshes in a pyramid shape
const radius = 1;
const height = 2;
const spacing = 0.5;
const levels = 4;

for (let level = 0; level < levels; level++) {
    const cylindersInLevel = levels - level;
    const yPos = level * (height + spacing);
    for (let i = 0; i < cylindersInLevel; i++) {
        for (let j = 0; j < cylindersInLevel; j++) {
            const xPos = (i - (cylindersInLevel - 1) / 2) * (radius * 2 + spacing);
            const zPos = (j - (cylindersInLevel - 1) / 2) * (radius * 2 + spacing);
            const position = new CANNON.Vec3(xPos, yPos, zPos);
            createCylinder(world, radius, height, position);
            createCylinderMesh(scene, radius, height, new THREE.Vector3(xPos, yPos, zPos));
        }
    }
}

// Create a sphere but position it initially out of view
const sphereRadius = 1;
const sphereShape = new CANNON.Sphere(sphereRadius);
const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape });
sphereBody.position.set(0, 0, 30);
world.addBody(sphereBody);

const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.copy(sphereBody.position);
scene.add(sphereMesh);

// Create a static plane for the ground
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
world.addBody(groundBody)

// Animate function
function animate() {
    requestAnimationFrame(animate);

    world.step(2 / 60);

    for (let i = 0; i < cylinderBodies.length; i++) {
        cylinderMeshes[i].position.copy(cylinderBodies[i].position);
        cylinderMeshes[i].quaternion.copy(cylinderBodies[i].quaternion);
    }

    // Update sphere position and rotation
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);


    renderer.render(scene, camera);
}
animate();

// Add event listener for mouse click
document.addEventListener('click', () => {
    const impulse = new CANNON.Vec3(0, 0, -50); // Adjust the impulse strength and direction as needed
    sphereBody.applyImpulse(impulse, sphereBody.position);
});

let clock = new THREE.Clock();

// Main loop
gsap.ticker.add(() => {

    stats.update();
    renderer.render(scene, camera);
    controls.update();
});
