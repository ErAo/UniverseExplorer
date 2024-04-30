'use client';

import React, { useState } from 'react';
import systemSolar from '../mocks/solar_system.json';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import * as Icon from 'react-feather';
import { InvisibleBtn } from './Buttons';
import { PrimaryBtn } from './Buttons';
import EditMenu from './EditMenu';
import { usePathname } from 'next/navigation';

const SideMenu = () => {
	const pathname = usePathname();
	const isEdit = pathname.endsWith('/edit') || pathname.endsWith('/new');

	const [solarSystemDB, setSolarSystemDB] = useState(systemSolar);
	const [isEditPage, setIsEditPage] = useState(false);

	const handleSystemChange = (newSystem) => {
		setSolarSystemDB({ ...newSystem.formData });
	};

	const handleEditView = () => {
		setIsEditPage(!isEdit);

		//if its edit, save data and redirect to the url without de '/edit'. If its not edit, redirect to the url with '/edit'
		if (isEdit) {
			//save data
			alert('Data saved');
			//redirect
			window.location.href = window.location.href.replace('/edit', '');
		} else {
			window.location.href = window.location.href + '/edit';
		}
	};

	return (
		<>
			<ul>
				<li>
					<Link href='/dashboard'>
						<Icon.Home size='21' />
						Dashboard
					</Link>
				</li>
				<li>
					<Link href='/dashboard/profile'>
						<Icon.User size='21' />
						Profile
					</Link>
				</li>
				<li>
					<Link href='/dashboard/collection'>
						<Icon.Grid size='21' />
						Collection
					</Link>
				</li>
				<li>
					<Link href='/dashboard/import'>
						<Icon.Upload size='21' />
						Import
					</Link>
				</li>
				<li>
					<Link href='/dashboard/export'>
						<Icon.Download size='21' />
						Export
					</Link>
				</li>
			</ul>
			<ul className='buttons flex'>
				<li style={{ marginRight: '1rem' }}>
					<InvisibleBtn func={() => signOut()}>SignOut</InvisibleBtn>
				</li>
				<li>{pathname && pathname.includes('model') && <PrimaryBtn func={() => handleEditView()}>{isEdit ? 'Save' : 'Edit'}</PrimaryBtn>}</li>
			</ul>
		</>
	);
};

export default SideMenu;
