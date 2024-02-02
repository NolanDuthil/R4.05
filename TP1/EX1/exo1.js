import * as THREE from 'three';


// Scene
// Créer un objet 
const scene = new THREE.Scene();


// Sphere
// Une classe pour générer la géométrie d'une sphere
const geometry = new THREE.SphereGeometry(3, 16, 16);
const material = new THREE.MeshPhysicalMaterial({
   color: 0xffff00,
   roughness: 0.5,
   metalness: 0.1,
   reflectivity: 10,
   clearCoat: 0.9,
   clearCoatRoughness: 0.5,
   lights: true,
   flatShading: true
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
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(800, 600);
renderer.render(scene, camera);

// 5. Plus il y a de pixels a calculer plus c'est long à charger
// Pour eviter des problèmes d'optimisation