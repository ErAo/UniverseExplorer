'use client';

import SceneInit from '../lib/SceneInit';
import { useEffect, useRef, useState } from 'react';
import Orbit from '../lib/Orbit';
import { encodeBase64 } from 'bcryptjs';

export default function SolarSystem({ solarSystemDB, cta }) {
	const canvasElement = useRef(null);
	const [threeScene, setThreeScene] = useState(null);
	const [planets, setPlanets] = useState(null);
	const [LocalSolarSystem, setLocalSolarSystem] = useState(null);

	useEffect(() => {
		if (!threeScene && LocalSolarSystem) {
			const { stars, planets } = LocalSolarSystem;
			setPlanets([...planets]);
			const initScene = async () => {
				const setStopOrbitRotation = (value) => (stopOrbitRotation = value);

				const getOrbSpeed = (year) => {
					return ((2 * Math.PI) / year);
				}

				const getPlanetRotationSpeed = (day) => {
					return (2 * Math.PI / day);
				}

				function animateRotation(object, delay = 1) {
					const base = 0.1;
					delay = !isNaN(delay) ? delay : 1;
					const { day } = object.config;
					const speed = getPlanetRotationSpeed(day) * (base * delay);
					object.mesh.rotation.y += speed;
					return speed;
				}

				function animateOrbitRotation(object, delay = 1) {
					const base = 0.1;
					delay = !isNaN(delay) ? delay : 1;
					const { year } = object.config;
					const speed = getOrbSpeed(year) * (base * delay);
					object.orbit.rotation.y += speed;
					return speed;
				}

				function generateRotation(systemMap, sphereType) {
					for (let key in systemMap[sphereType]) {
						const object = systemMap[sphereType][key];
						if (sphereType != 'layers') {
							animateOrbitRotation(object, object.config.orbit_speed);
							animateRotation(object, object.config.rotation_speed);
						} else {
							animateRotation({
								config: {
									distance: systemMap.config.distance,
									day: systemMap.config.day
								},
								mesh: object.mesh
							}, object.config.rotation_speed);
						}


						if (object.layers) {
							generateRotation(object, 'layers')
						}
						if (object.moons) {
							generateRotation(object, 'moons')
						}
					}
				}



				let newScene = new SceneInit();
				newScene.initScene(setStopOrbitRotation, canvasElement.current);
				newScene.animate();

				setThreeScene(newScene);

				const configOrbit = {
					...stars[0],
					planets,
					ambientLight: true,
					directionalLight: true,
					isMainStar: true,
				};

				const orbit = new Orbit({
					config: configOrbit,
					scene: newScene.scene,
					camera: newScene.camera,
					controls: newScene.controls,
					renderer: newScene.renderer
				});

				const { mesh, orbit: orbit_system, systemMap } = orbit.getMesh();
				//console.log(orbit_system)
				orbit_system.matrixAutoUpdate = true;
				newScene.scene.add(orbit_system);
				newScene.systemMap = systemMap

				let stopOrbitRotation = false;

				const animate = () => {
					mesh.rotation.y += 2 * Math.PI / (1 * 60 * 60);
					generateRotation(systemMap, 'planets')

					requestAnimationFrame(animate);
				};
				animate();

				cta(() => {
					return {
						newScene,
						setThreeScene,
						planets,
						LocalSolarSystem,
						setLocalSolarSystem,
						element: canvasElement.current
					}
				})
			};

			initScene();
		} else if (threeScene === null) {
			setLocalSolarSystem({ ...solarSystemDB });
		}
	}, [LocalSolarSystem]);

	return (
		<div className='SolarSystem'>
			<canvas ref={canvasElement} id='myThreeJsCanvas' key={encodeBase64(JSON.stringify(solarSystemDB))} />
			<div id='planets-list'>
				{planets?.map((planet, index) => (
					<div
						key={`planet-${planet.name}_${index}`}
						id={planet.name}
						onClick={function () {
							threeScene.selectPlanet(planet.name);
						}}>
						<figure
							className='sphere'
							style={{
								'--sphere_bg': `url(${planet.texture}) repeat-x`,
							}}></figure>
					</div>
				))}
			</div>
		</div>
	);
}
