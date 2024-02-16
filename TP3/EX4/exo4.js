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

const planeGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffc0cb })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(Math.PI * -0.5, 0, 0);
scene.add(plane);

const cylinderGeometry = new THREE.CylinderGeometry(.5,.5,25,10);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.receiveShadow = true;
cylinder.position.set(0,15,-2)
cylinder.rotation.set(Math.PI * -0.5, 0, 0);
scene.add(cylinder);

const cylinder1Geometry = new THREE.CylinderGeometry(0.25,0.25,9,20);
const cylinder1Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const cylinder1 = new THREE.Mesh(cylinder1Geometry, cylinder1Material);
cylinder1.receiveShadow = true;
cylinder1.position.set(0,10.5,8)
scene.add(cylinder1);

const sphere1Geometry = new THREE.SphereGeometry(2,20,10);
const sphere1Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
sphere1.receiveShadow = true;
sphere1.position.set(0,5,8)
scene.add(sphere1);

const cylinder2Geometry = new THREE.CylinderGeometry(0.25,0.25,7,20);
const cylinder2Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const cylinder2 = new THREE.Mesh(cylinder2Geometry, cylinder2Material);
cylinder2.receiveShadow = true;
cylinder2.position.set(0,11.5,2)
scene.add(cylinder2);

const sphere2Geometry = new THREE.SphereGeometry(2,20,10);
const sphere2Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
sphere2.receiveShadow = true;
sphere2.position.set(0,6,2)
scene.add(sphere2);

const cylinder3Geometry = new THREE.CylinderGeometry(0.25,0.25,5,20);
const cylinder3Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const cylinder3 = new THREE.Mesh(cylinder3Geometry, cylinder3Material);
cylinder3.receiveShadow = true;
cylinder3.position.set(0,12.5,-4)
scene.add(cylinder3);

const sphere3Geometry = new THREE.SphereGeometry(2,20,10);
const sphere3Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const sphere3 = new THREE.Mesh(sphere3Geometry, sphere3Material);
sphere3.receiveShadow = true;
sphere3.position.set(0,8,-4)
scene.add(sphere3);

const cylinder4Geometry = new THREE.CylinderGeometry(0.25,0.25,3,20);
const cylinder4Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const cylinder4 = new THREE.Mesh(cylinder4Geometry, cylinder4Material);
cylinder4.receiveShadow = true;
cylinder4.position.set(0,13.5,-10)
scene.add(cylinder4);

const sphere4Geometry = new THREE.SphereGeometry(2,20,10);
const sphere4Material = new THREE.MeshStandardMaterial({ color: 0xA3B6F9 })
const sphere4 = new THREE.Mesh(sphere4Geometry, sphere4Material);
sphere4.receiveShadow = true;
sphere4.position.set(0,10,-10)
scene.add(sphere4);

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

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


function loop() {
  
    
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();

