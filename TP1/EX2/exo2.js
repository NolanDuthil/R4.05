import * as THREE from 'three';


// Scene
const scene = new THREE.Scene();


// Sphere
const geometry = new THREE.SphereGeometry(3, 45, 45);
const material = new THREE.MeshPhysicalMaterial({
   color: 0xff00ff,
   roughness: 0.5,
   metalness: 0.1,
   reflectivity: 0.5,
   clearCoat: 0.9,
   clearCoatRoughness: 0.5,
   lights: true,
   flatShading: false
 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

let degreeY = 0;

let angle = 0;

const loop = () => {
  // Ajoutez ci-dessous le code pour faire tourner la sphère
  // mesh.rotateY(degreeY+0.01);
  angle += 0.05;
  light.position.set(10*Math.cos(angle), 10, 10*Math.sin(angle));
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();