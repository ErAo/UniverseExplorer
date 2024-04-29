import * as THREE from "three";
import Sphere from "./Sphere";
import Ring from "./Ring";
import Rotation from "./Rotation";

export default class Orbit {
    constructor(config) {
        this.config = config.config;
        this.orbit = null;
        this.mesh = null;
        this.scene = config.scene;
        this.camera = config.camera;
        this.controls = config.controls;
        this.renderer = config.renderer;
        this.scene = config.scene;
        this.targetCamera = null;
        // system map
        this.systemMap = {
            orbit: null,
            mesh: null,
            name: "",
            planets: {},
            rings: {},
            moons: {},
            layers: {},
            rotation: null,
            config: this.config
        };
    }

    setDirectionalLight() {
        const light = new THREE.PointLight(0xffffff, 1, 0, 0, 1);

        // shadow
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.shadow.bias = -0.005;
        light.shadow.radius = 4;


        this.scene.add(light);
    }

    setAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.09);
        this.scene.add(ambientLight);
    }

    getMesh() {
        const config = this.config;
        if (this.orbit === undefined || this.orbit === null) {

            const sphere = new Sphere(config.radius, config.distance, config.texture, config.prefix);
            this.mesh = sphere.getMesh();

            // create mesh for camera lookAt 

            this.targetCamera = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xffff00 }));

            // name 
            this.mesh.name += (config.prefix ? "_" : '') + config.name;
            this.targetCamera.name = this.mesh.name + "_camera";
            this.mesh.add(this.targetCamera);

            if (config.isMainStar) {
                const texture = new THREE.TextureLoader().load(config.texture);
                this.mesh.position.set(0, 0, 0);
                // change material
                this.mesh.material.emissiveIntensity = 1
                this.mesh.material.emissive = new THREE.Color(0xffffff)
                this.mesh.material.emissiveMap = texture
            } else {
                this.mesh.receiveShadow = true;
                this.mesh.castShadow = true;
            }

            this.orbit = new THREE.Group();
            this.orbit.name += 'orbit_' + (config.prefix ? "_" : '') + config.name;
            this.orbit.add(this.mesh);

            this.systemMap.orbit = this.orbit;
            this.systemMap.mesh = this.mesh;
            this.systemMap.name = this.mesh.name;
            this.systemMap.targetCamera = this.targetCamera;

            // has orbit parent
            if (config.orbitParent) {
                config.orbitParent.add(this.orbit);
            }

            if (config.directionalLight) {
                this.setDirectionalLight();
            }

            if (config.ambientLight) {
                this.setAmbientLight();
            }
            if (config.planets) {
                config.planets.forEach((planet, index) => {
                    planet.prefix = "planet";
                    planet.directionalLight = true;
                    const planetOrbit = new Orbit({
                        config: planet,
                        scene: this.scene,
                        camera: this.camera,
                        controls: this.controls,
                        renderer: this.renderer,
                        orbitParent: this.orbit,
                    });

                    const { orbit, mesh, systemMap } = planetOrbit.getMesh();
                    this.orbit.add(orbit);
                    const suffix = this.systemMap.planets[mesh.name] ? '_' + index : '';
                    this.systemMap.planets[mesh.name + suffix] = systemMap
                });
            }

            if (config.moons) {
                config.moons.forEach((moon, index) => {
                    moon.prefix = "moon";
                    moon.distance += config.radius;
                    const MoonOrbit = new Orbit({
                        config: moon,
                        scene: this.scene,
                        camera: this.camera,
                        controls: this.controls,
                        renderer: this.renderer,
                        orbitParent: this.orbit
                    });

                    const { orbit, mesh, systemMap } = MoonOrbit.getMesh();
                    this.mesh.add(orbit);
                    const suffix = this.systemMap.moons[mesh.name] ? '_' + index : '';
                    this.systemMap.moons[mesh.name + suffix] = systemMap
                });
            }

            if (config.rings) {
                config.rings.forEach(ring => {
                    const ringOrbit = new Ring(
                        ring.insideRadius,
                        ring.outsideRadius,
                        ring.segments,
                        ring.textureFile
                    );
                    const { mesh } = ringOrbit.getMesh();
                    this.mesh.add(mesh);

                    const suffix = this.systemMap.rings[mesh.name] ? '_' + index : '';
                    this.systemMap.rings[mesh.name + suffix] = {
                        mesh,
                        config: ring
                    }
                });
            }

            if (config.layers) {
                config.layers?.forEach((layer, index) => {
                    const newLayer = new Sphere(layer.radius, 0, layer.texture, 'layer');
                    const layerMesh = newLayer.getMesh();
                    // planet opacities
                    layerMesh.material.transparent = true;
                    layerMesh.material.opacity = layer.opacity;
                    this.mesh.add(layerMesh);
                    const suffix = this.systemMap.layers[layerMesh.name] ? '_' + index : '';
                    this.systemMap.layers[layerMesh.name + suffix] = {
                        mesh: layerMesh,
                        config: layer
                    }
                })
            }

            const rotation = new Rotation(this.mesh);
            this.orbit.add(rotation.getMesh());
            this.systemMap.rotation = rotation.getMesh();
        }

        return this;
    }
}
