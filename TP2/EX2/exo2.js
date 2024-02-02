import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);



const scene = new THREE.Scene();

// an array of objects whose rotation to update
const objects = [];

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

// use just one sphere for everything
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
    radius, widthSegments, heightSegments);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.PointLight(color, intensity);
scene.add(light);

const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


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

const grille = new THREE.GridHelper(25, 15);
scene.add(grille);

const gui = new GUI();

const obj = {
	soleil: true,
	terre: true,
	lune: true,
    grille: true,
	vitesse: 0.01, 
}

gui.add( obj, 'soleil' );	
gui.add( obj, 'terre' ); 	
gui.add( obj, 'lune' ); 	
gui.add( obj, 'grille' ); 	
gui.add( obj, 'vitesse', 0.01, 0.1 ); // min, max

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
    let vit = obj.vitesse 
    earthOrbit.rotateY(vit);
    moonMesh.rotateY(vit);
    earthMesh.rotateY(vit);
    solarSystem.rotateY(vit);
    earthMesh.visible = obj.terre;
    moonMesh.visible = obj.lune;
    sunMesh.visible = obj.soleil;
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
    scene.add(new THREE.AxesHelper(10));
    scene.add(new THREE.PointLightHelper(light));
    grille.visible = obj.grille;
    // Pour la mise à jour
    stats.update();
    
}
loop();

