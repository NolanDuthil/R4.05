import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Fog
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

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
camera.position.set(10, 10, 20);
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// Resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

class Bullet extends THREE.Group {
    constructor(x, y, z, orientation) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
        this.orientation = orientation;
        this.life = 200;

        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(.2, 32, 16),
            new THREE.MeshLambertMaterial({ color: "#ff0000" })
        );
        this.bullet.castShadow = true;
        this.add(this.bullet);
        this.position.set(x, y, z)
    }

    isAlive() {
        return this.life > 0;
    }

    update() {
        this.life--;
        const speed = 1.1;
        this.position.x += speed * Math.sin(this.orientation)
        this.position.z += speed * Math.cos(this.orientation)
    }

}

class Figure extends THREE.Group {
    constructor(params) {
        super();
        this.params = {
            x: 0,
            y: 1.4,
            z: 0,
            ry: 0,
        }

        this.position.x = this.params.x;
        this.position.y = this.params.y;
        this.position.z = this.params.z;

        // model
        var self = this;
        const loader = new GLTFLoader();
        loader.load('./RobotExpressive.glb', function (gltf) {

            self.add(gtlf.scene);

        }, undefined, function (e) {

            console.error(e);

        });

    }

    update() {
        // bullet
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].isAlive()) {
                bullets[i].update();
            }
            else {
                scene.remove(bullets[i]);
                bullets.slice(i, 1);
            }
        }
    }
}

const figure = new Figure();
figure.init();

gsap.registerPlugin(CustomEase);

let bullets = [];

document.addEventListener('keydown', (event) => {
    if ((event.key == ' ') && (jumpTimeline.isActive() == false)) {
        jumpTimeline.to(figure.params, {
            y: 3,
            armRotation: degreesToRadians(90),
            repeat: 1,
            yoyo: true,
            duration: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0.479,-0.727 0.332,0.246 0.601,0.663 0.743,0.884 0.818,1.001 1,1 "),
        })
    }
    if (event.key == 'q') {
        rySpeed += 0.05
        leftKeyIsDown = true
    }

    if (event.key == 'd') {
        rySpeed -= 0.05
        rightKeyIsDown = true
    }
    if (event.key == 'z') {
        walkSpeed += .1;
        upKeyIsDown = true

    }
    if (event.key == 'f') {
        let bullet = new Bullet(figure.params.x, figure.params.y, figure.params.z, figure.params.ry);
        scene.add(bullet);
        bullets.push(bullet);
    }


});

document.addEventListener('keyup', (event) => {

    if (event.key == 'q') {
        leftKeyIsDown = false
    }

    if (event.key == 'd') {
        rightKeyIsDown = false
    }
    if (event.key == 'z') {
        upKeyIsDown = false

    }

});


// Main loop
gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;

    if (leftKeyIsDown) {
        rySpeed += .001;
    }
    if (rightKeyIsDown) {
        rySpeed += .001;
    }
    if (upKeyIsDown) {
        walkSpeed += .001;
    }
    figure.update();
    controls.update();
    stats.update();
    renderer.render(scene, camera);
});


