import * as THREE from "three";

export default class Planet {
  constructor(radius, positionX, textureFile, prefix = "") {
    this.radius = radius;
    this.positionX = positionX ? positionX : 0;
    this.textureFile = textureFile;
    this.prefix = prefix;
  }

  getMesh() {
    if (this.mesh === undefined || this.mesh === null) {
      const geometry = new THREE.SphereGeometry(this.radius, 100, 100);
      const texture = new THREE.TextureLoader().load(this.textureFile);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.x += this.positionX;
      this.mesh.name = this.prefix;
    }
    return this.mesh;
  }
}
