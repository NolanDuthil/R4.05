import * as THREE from 'three';

export default class Particle {
  constructor(scene) {
      this.x = 0;
      this.y = 0; 
      this.z = 0; 
      this.vx = THREE.MathUtils.randFloat(-1, 1);
      this.vy = THREE.MathUtils.randFloat(5, 1);
      this.vz = THREE.MathUtils.randFloat(-1, 1);
      this.alpha = 255;

      this.geometry = new THREE.SphereGeometry(2, 32, 32);
      this.material = new THREE.MeshBasicMaterial({ color: 0xff69b4, transparent: true, opacity: this.alpha / 255 });
      this.mesh = new THREE.Mesh(this.geometry, this.material);

      this.mesh.position.set(this.x, this.y, this.z);

      scene.add(this.mesh);
  }

  finished() {
      return this.alpha < 0;
  }

  update() {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      this.alpha -= 5;

      this.mesh.position.set(this.x, this.y, this.z);
      this.mesh.material.opacity = this.alpha / 255;
  }
}