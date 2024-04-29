'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import Earth from '../../../components/Earth';
import Layout from '../../../layouts/DashboardLayout';

export default function Page() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	const { user } = session;
	console.log(user);

	return (
		<Layout>
			<Earth />
			<h3>
				You are {user._doc.first_name} {user._doc.last_name}{' '}
			</h3>
		</Layout>
	);
}
