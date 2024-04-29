'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../partials/Footer';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Earth from '../../components/Earth';
import { PrimaryBtn } from '../../components/Buttons';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const messages = {
		loading: (
			<div style={{ display: 'block' }}>
				<p style={{ margin: 0, lineHeight: '1.4rem' }}>Loading...</p>
			</div>
		),
		success: (
			<div style={{ display: 'block' }}>
				<p style={{ margin: 0, lineHeight: '1.4rem' }}>Excellent! You have successfully logged in</p>
			</div>
		),
		error: (message) => (
			<div style={{ display: 'block' }}>
				<p style={{ margin: 0, lineHeight: '1.4rem' }}>An error has occurred: </p>
				<p style={{ margin: 0, lineHeight: '1.4rem' }}>{message}</p>
			</div>
		),
	};

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		const toastLoading = toast.loading(messages.loading, { position: 'bottom-right' });

		try {
			const res = await signIn('credentials', {
				email: email,
				password: password,
				redirect: false,
			});

			if (res.ok) {
				toast.dismiss(toastLoading);
				toast.success(messages.success, { duration: 4000, position: 'bottom-right' });
				await new Promise((resolve) => setTimeout(resolve, 1000));
				router.push('/dashboard');
				router.refresh();
			} else {
				if (res.error) {
					throw new Error(res.error);
				} else {
					throw new Error('Error trying to login');
				}
			}
		} catch (error) {
			setLoading(false);
			toast.dismiss(toastLoading);
			toast.error(messages.error(error.message), { duration: 4000, position: 'bottom-right' });
			setError(error.message);
		}
	};

	return (
		<>
			<Navigation />
			<section id='login'>
				<Earth />
				<div className='container'>
					<div className='login section'>
						<form onSubmit={handleSubmit}>
							<h2>
								Log<span>In</span>
							</h2>
							<div className='input_item'>
								<label>
									Email
									<input required onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Write your email' name='email' />
								</label>
							</div>

							<div className='input_item'>
								<label>
									Password
									<input required onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Write your password' name='password' />
								</label>
							</div>

							<PrimaryBtn clases={`submit`} disabled={loading ? true : false}>
								{loading ? messages.loading : 'SignIn'}
							</PrimaryBtn>
						</form>
					</div>
					<Toaster />
				</div>
			</section>
			<Footer />
		</>
	);
}
