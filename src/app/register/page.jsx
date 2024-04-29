'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../partials/Footer';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Earth from '../../components/Earth';
import { PrimaryBtn } from '../../components/Buttons';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const invalidPassword = password !== confirmPassword;
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
				<p style={{ margin: 0, lineHeight: '1.4rem' }}>Great! You have been registered successfully!</p>
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
		e.preventDefault();
		setLoading(true);
		const toastLoading = toast.loading(messages.loading, { position: 'bottom-right' });
		try {
			const signUpResponse = await fetch('http://localhost:3000/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({ first_name, last_name, email, password }),
			});

			if (signUpResponse.ok) {
				const res = await signIn('credentials', {
					email: email,
					password: password,
					redirect: false,
				});

				if (res.ok) {
					toast.dismiss(toastLoading);
					toast.success(messages.success, { duration: 4000, position: 'bottom-right' });
					router.push('/dashboard');
					router.refresh();
				}
			} else {
				const errorData = await signUpResponse.json();
				if (errorData.erros) {
					setError(errorData.errors);
				} else {
					throw new Error(errorData.message || 'Error to signup');
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
			<section id='signup'>
				<Earth />
				<div className='container'>
					<div className='signup section'>
						<form onSubmit={handleSubmit}>
							<h2>
								Sign<span>Up</span>
							</h2>
							<div className='half'>
								<div className='input_item'>
									<label>
										<div>
											Name <span>*</span>
										</div>
										<input required onChange={(e) => setFirstName(e.target.value)} type='text' placeholder='Jhon' name='first_name' />
									</label>
								</div>
								<div className='input_item'>
									<label>
										<div>
											Last Name <span>*</span>
										</div>
										<input required onChange={(e) => setLastName(e.target.value)} type='text' placeholder='Due' name='last_name' />
									</label>
								</div>
							</div>
							<div className='input_item'>
								<label>
									<div>
										Email <span>*</span>
									</div>
									<input required type='email' onChange={(e) => setEmail(e.target.value)} placeholder='jhondue@gmail.com' name='email' />
								</label>
							</div>
							<div className='half'>
								<div className='input_item'>
									<label>
										<div>
											Password <span>*</span>
										</div>
										<input required type='password' onChange={(e) => setPassword(e.target.value)} placeholder='********' name='password' />
									</label>
								</div>
								<div className='input_item'>
									<label>
										<div>
											Confirm password <span>*</span>
										</div>
										<input required type='password' onChange={(e) => setConfirmPassword(e.target.value)} placeholder='********' name='password' />
									</label>
									{invalidPassword && <p className='warning'>Passwords not matching.</p>}
								</div>
							</div>

							<PrimaryBtn clases={`submit`} disabled={invalidPassword || password == '' || loading ? true : false}>
								{loading ? messages.loading : 'Confirm'}
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
