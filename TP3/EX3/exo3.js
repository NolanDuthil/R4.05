import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

const scene = new THREE.Scene();

scene.background = new THREE.CubeTextureLoader().setPath('./assets/').load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);

const planeGeometry = new THREE.PlaneGeometry(25, 25, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffc0cb })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(Math.PI * -0.5, 0, 0);
scene.add(plane);

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);


light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;




const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function Renderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

requestAnimationFrame(Renderer);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

let x = 15;
let y = 9;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const nombreMaxCubes = 70; // Définir le nombre maximal de cubes à générer
let cubesGenerated = 0; // Variable pour suivre le nombre de cubes générés

function loop() {
  const initialY = 5; // Stocker la position y initiale constante du cube
  
  if (cubesGenerated < nombreMaxCubes) {
    const boxHeight = Math.floor(Math.random() * (10 - 3)) + 3; // Taille variable du cube
    const cubeGeometry = new THREE.BoxGeometry(1, boxHeight, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const box = new THREE.Mesh(cubeGeometry, cubeMaterial);
    box.receiveShadow = true;
    box.castShadow = true;

    if (x <= -10) {
      y -= 2;
      x = 15;
    }
    
    // Définir la position en tenant compte de la hauteur variable mais en gardant y constant
    box.position.set(x -= 4, initialY + boxHeight / 2, y); 
    scene.add(box);

    cubesGenerated++;
  }
    
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();

