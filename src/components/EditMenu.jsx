import React from 'react';
import Link from 'next/link';
import * as Icon from 'react-feather';
import { InvisibleBtn } from './Buttons';
import { PrimaryBtn } from './Buttons';
import { usePathname } from 'next/navigation';
import SolarSystemForm from './SolarSystemForm';

const SideMenu = ({ openModal, isPreview, handleChange, schema, saveSystem, formData = {} }) => {
	const pathname = usePathname();

	return (
		<>
			<SolarSystemForm handleChange={handleChange} schema={schema} formData={formData} />
			<ul className='buttons flex has-sticky-bottom'>
				<li>{pathname && pathname.includes('model') && (
					<PrimaryBtn func={saveSystem}>
						<Icon.Save />
						Save
					</PrimaryBtn>
				)}</li>
				<li>
					<PrimaryBtn func={openModal}>
						{isPreview ? <Icon.EyeOff /> : <Icon.Eye />}
						Show Preview
					</PrimaryBtn>
				</li>
			</ul>
		</>
	);
};

export default SideMenu;
