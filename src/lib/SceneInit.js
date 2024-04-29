import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import Stats from "three/examples/jsm/libs/stats.module";

export default class SceneInit {
  constructor(fov = 75, camera, scene, stats, controls, renderer) {
    this.fov = fov;
    this.scene = scene;
    //this.stats = stats;
    this.camera = camera;
    this.controls = controls;
    this.renderer = renderer;
    this.rayCaster = null;
    this.INTERSECTED = null;
    this.pointer = null;

    this.initialDistance = 20;
    this.moveActive = false;
    this.previousPosition = {
      x: 0,
      y: 0,
      z: 0
    };

    this.currentRotation = {
      x: 0,
      y: 0,
      z: 0
    }

    this.sunInitialDistance = 128;
    this.systemMap = 0;
    this.targetCamera = 0;
  }

  initScene(setStopOrbitRotation, element) {
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      0.01,
      10000
    );
    this.camera.position.z = 128;

    this.camera.enableDamping = true;

    this.scene = new THREE.Scene();

    // rayCaster
    this.rayCaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.renderer = new THREE.WebGLRenderer({
      canvas: element,
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    element.classList.add('canvas-init')
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    //OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    //Renderer
    this.renderer.domElement.addEventListener('click', (event) => this.onPointerClick(event, setStopOrbitRotation), false);
    this.renderer.domElement.addEventListener('wheel', (event) => this.onWheel(event), false);
    this.renderer.domElement.addEventListener('scroll', (event) => this.onWheel(event), false);

    this.renderer.domElement.addEventListener('mousedown', (event) => this.onMouseDown(event, setStopOrbitRotation), false);
    this.renderer.domElement.addEventListener('mouseup', (event) => this.onMouseUp(event, setStopOrbitRotation), false);
    this.renderer.domElement.addEventListener('mousemove', (event) => this.onMove(event), false);

    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  resetScene() {
    this.scene = new THREE.Scene();
    this.camera.position.z = 128;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseDown(event, setStopOrbitRotation) {
    if (this.INTERSECTED) {
      this.moveActive = true;
      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  }

  onMove(event) {
    if (this.moveActive) {
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y,
        z: 0
      };

      const toRadians = (angle) => {
        return angle * (Math.PI / 180);
      };

      const sphere = this.INTERSECTED.targetCamera;

      let deltaX = -deltaMove.y * 1;
      let deltaY = -deltaMove.x * 1;

      let deltaXRadians = toRadians(deltaX);
      let deltaYRadians = toRadians(deltaY);
      let deltaZRadians = toRadians(0);

      let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(deltaXRadians, deltaYRadians, deltaZRadians, 'XYZ')
      );

      sphere.quaternion.multiplyQuaternions(deltaRotationQuaternion, sphere.quaternion);

      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  }

  onMouseUp(event, setStopOrbitRotation) {
    this.moveActive = false
  }

  onWheel(event) {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    this.initialDistance += delta;
  }

  selectPlanet(planetName) {
    const object = this.systemMap['planets']['planet_' + planetName];
    const targetCamera = object;
    this.INTERSECTED = targetCamera;
    // delete last ref object
    this.updateCamera(targetCamera);

    this.initialDistance = object.config.radius * 2;
  }

  onPointerClick(event, setStopOrbitRotation) {
    event.stopPropagation()

    const closest = event.target === this.renderer.domElement;
    if (!closest) return;

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.rayCaster.setFromCamera(this.pointer, this.camera);

    const intersects = this.rayCaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object instanceof THREE.Mesh && object.parent instanceof THREE.Group && i == intersects.length - 1) {
          //this.INTERSECTED = object;
          //this.updateCamera(this.INTERSECTED)
          //setStopOrbitRotation(true);
        }
      }
    }
  }

  planetPosition(planetMesh) {
    const planetPosition = new THREE.Vector3();
    planetPosition.setFromMatrixPosition(planetMesh.matrixWorld);
    return planetPosition;
  }

  planetTargetPosition(planetMesh) {
    const planetPosition = this.planetPosition(planetMesh);
    const targetPosition = planetPosition.clone().add(new THREE.Vector3(0, 0, this.initialDistance))
    return { targetPosition, planetPosition };
  }

  calcRotationZ(x, y) {
    const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return z;
  }

  updateCamera(targetCamera = this.INTERSECTED, controls = false) {
    if (targetCamera) {

      const { orbit, mesh: planet, targetCamera: fakeCamera } = targetCamera;

      const planetPosition = new THREE.Vector3();
      planetPosition.setFromMatrixPosition(planet.matrixWorld);

      const offset = new THREE.Vector3(0, 0, this.initialDistance);
      const positionCamera = offset.applyQuaternion(fakeCamera.quaternion).add(planetPosition);

      this.camera.position.copy(positionCamera);
      this.camera.lookAt(planetPosition);

    }
  }

  animate() {
    // requestAnimationFrame(this.animate.bind(this));
    requestAnimationFrame(this.animate.bind(this));

    this.render();
    //this.stats.update();
    //this.controls.update();
  }

  render() {
    this.updateCamera()

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
