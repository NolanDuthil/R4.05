import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

const scene = new THREE.Scene();

scene.background = new THREE.CubeTextureLoader().setPath('./assets/').load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);

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


const geometrybox = new THREE.BoxGeometry(2, 5, 1);
const materialbox = new THREE.MeshBasicMaterial({ color: 0x73C2FB });
const box = new THREE.Mesh(geometrybox, materialbox);
box.translateY(4);
box.castShadow = true; 
box.receiveShadow = false;
scene.add(box);

const geometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xFFC0CB, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.set(Math.PI * 0.5, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
    // Pour la mise à jour
    stats.update();

}
loop();