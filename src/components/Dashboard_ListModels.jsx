import React from 'react';
import Link from 'next/link';
import Earth from './Earth';
// get server session
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/authOptions';


const Dashboard_ListModels = async () => {
	const list = [
		['New System', 'Description', '/dashboard/model/create'],
	];
	const session = await getServerSession(authOptions);
	async function getSystems() {
		const res = await fetch(`http://localhost:3000/api/solarSytstem?user_id=${session?.user?._doc?._id}`, {
			method: 'GET'
		});

		if (res.ok) {
			const { data } = await res.json();
			return data;
		} else {
			const errorData = await res.json();
			console.error(errorData.message);
			return [];
		}
	}
	const getRecords = await getSystems();
	getRecords.forEach((record) => {
		list.push([record.display_name, record.description, `/dashboard/model/${record._id}`]);
	});
	return (
		<div className='dashboard__content-container'>
			<Earth />
			{list.map(([item, description, link], index) => (
				<Link key={index} href={link} className='dashboard_content-item'>
					<h3>{item}</h3>
					<p>{description}</p>
				</Link>
			))}
		</div>
	);
};

export default Dashboard_ListModels;
