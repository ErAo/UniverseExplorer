import Navigation from '../components/Navigation';
import Footer from '../partials/Footer';
import Link from 'next/link';
import Earth from '../components/Earth';
import { PrimaryBtn } from '../components/Buttons';
import DevelopersSection from '../partials/DevelopersSection';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';


export default function Home() {
	const session = getServerSession(authOptions);
	return (
		<>
			<Navigation />
			<Earth />
			<section id='hero'>
				<div className='container'>
					<div className='hero section'>
						<h1>Universe Explorer</h1>
						<h4>
							Explore 3D solar systems with this web app! Moreover, you'll be able to bring solar systems from your imagination to life with just a few steps and use
							them to create stunning exhibitions or even share them with your friends. <br /> Don't miss out, register now!
						</h4>
						<div className='buttons'>
							<Link href='/dashboard'>
								<PrimaryBtn>Make your solar system 🚀</PrimaryBtn>
							</Link>
						</div>
					</div>
				</div>
			</section>
			<DevelopersSection />
			<Footer />
		</>
	);
}
