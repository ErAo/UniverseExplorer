import React from 'react';
import Link from 'next/link';
import { PrimaryBtn } from '../components/Buttons';
import DevelopersSection from '../partials/DevelopersSection';
import * as Icon from 'react-feather';

const Footer = () => {
	return (
		<footer id='footer'>
			<div className='container'>
				<div className='footer section'>
					<div className='copyright'>
						<p className='copy'>Made with 💛 by the hackathon team.</p>
						<div className='git_link'>
							<Link href={'https://github.com/SantiagoCode/UniverseExplorer'} target='_blank'>
								<PrimaryBtn>
									<Icon.GitHub size={24} />
									View on GitHub
								</PrimaryBtn>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
