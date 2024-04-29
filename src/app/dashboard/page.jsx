'use client';

import React from 'react';
import Link from 'next/link';
import Earth from '../../components/Earth';
import Layout from '../../layouts/DashboardLayout';
const page = () => {
	return (
		<Layout>
			<h3>Tus ultimos modelos</h3>
			<div className='dashboard__content-grid'>
				<Items />
			</div>
		</Layout>
	);
};

const Items = () => {
	const list = [
		['New System', 'Description', '/dashboard/model/new'],
		['Solar System', 'Description', '/dashboard/model/solar_system'],
		['Kepler-22', 'Description', '/dashboard/model/kepler_22'],
		['Kepler-62', 'Description', '/dashboard/model/kepler_62'],
	];

	return (
		<div className='dashboard__content-container'>
			<Earth />
			{list.map(([item, description, link]) => (
				<Link href={link} className='dashboard_content-item'>
					<h3>{item}</h3>
					<p>{description}</p>
				</Link>
			))}
		</div>
	);
};

export default page;
