import React from 'react';
import SolarSystemLayout from '../../../../layouts/SolarSystemLayout';
import Layout from '../../../../layouts/DashboardLayout';
export default function Page({ params }) {
	const { model } = params;
	return (
		<Layout>
			<SolarSystemLayout model={model}></SolarSystemLayout>
		</Layout>
	);
}
