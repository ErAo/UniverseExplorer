import React from 'react';
import Layout from '../../layouts/DashboardLayout';
const page = () => {
	return (
		<Layout>
			<h3>Tus ultimos modelos</h3>
			<div className='dashboard__content-grid'>
				<Dashboard_ListModels />
			</div>
		</Layout>
	);
};

export default page;
