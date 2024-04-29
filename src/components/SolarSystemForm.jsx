'use client';

import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
const log = (type) => console.log.bind(console, type);

// generate schema from json file

// read json file and convert to schema


const jsonNames = {
	"stars": 'Estrellas ',
	"planets": 'Planetas ',
	"moons": 'Lunas ',
	"speed": 'Velocidad ',
	"layers": 'Capas ',
	"name": "Identificador",
	"display_name": "Nombre a mostrar",
	"radius": "Radio",
	"texture": "Textura",
	"orbit_speed": "Velocidad de traslación",
	"rotation_speed": "Velocidad de rotación",
	"description": "Descripción",
	"distance": "Distancia",
	"day": "Duración del día en horas",
	"year": "Duración del año en días",
	"opacity": 'Opacidad ',
	"prefix": "Prefijo",
	"insideRadius": "Distancia del Radio interior",
	"outsideRadius": "Distancia del Radio exterior",
	"segments": "Segmentos",
	"directionalLight": "Iluminación direccional",
}

function convertJsonToSchema(json) {
	let title = json.display_name ? json.display_name : 'Solar System';
	let schema = {
		type: 'object',
		title: title,
		properties: {},
	};

	for (let key in json) {
		let value = json[key];
		let type = typeof value;

		let title = jsonNames[key] ? jsonNames[key] : key;
		if (Array.isArray(value)) {
			type = 'array';
			value = [value[0]];
			title = title;
		}
		let property = {
			type: type,
			title: title,
			default: value,
		};

		if (key === 'texture') {
			property.format = 'data-url';
		}

		if (type === 'object') {
			property.properties = convertJsonToSchema(value);
		} else if (type === 'array') {
			property.items = convertJsonToSchema(value[0]);
		} else {
			property.default = value;
		}

		schema.properties[key] = property;
	}

	return schema;
}

export default function page({ schema, handleChange }) {
	return <Form
		schema={convertJsonToSchema({ ...schema })}
		onChange={handleChange}
		validator={validator}
		formData={{ ...schema }}
		onSubmit={log('submitted')}
		onError={log('errors')}
	/>;
}
