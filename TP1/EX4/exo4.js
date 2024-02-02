import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

let degreeY = 0;
let angle = 0;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
  mesh.rotateY(degreeY+0.01);
  angle += 0.05;
  light.position.set(10 * Math.cos(angle), 10, 10 * Math.sin(angle));
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  scene.add(new THREE.AxesHelper(10));
  scene.add(new THREE.PointLightHelper(light));
  scene.add(new THREE.GridHelper(10, 15));
}

loop();

gsap.fromTo(mesh.scale, {x: .5, y: .5, z: .5}, {x: 1.5, y: 1.5, z: 1.5, duration: 5, ease: "elastic"});

const box = document.querySelector(".webgl");
const pageX = document.getElementById("x");
const pageY = document.getElementById("y");

function updateDisplay(event) {
  pageX.innerText = event.pageX;
  pageY.innerText = event.pageY;
}

box.addEventListener("mousemove", updateDisplay, false);
box.addEventListener("mouseenter", updateDisplay, false);
box.addEventListener("mouseleave", updateDisplay, false);

function randomColor() {
  let r = Math.floor(256* Math.random());
  let g = Math.floor(256* Math.random());
  let b = Math.floor(256* Math.random());

  return new THREE.Color(r,g,b);

}

window.addEventListener("mousedown", (event) => {
  gsap.to(mesh.material, {color: randomColor})

})

