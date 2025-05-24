"use client"

import Link from "next/link";
import { useState } from "react";

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = () => {
		fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		})
			.then(res => res.json())
			.then(data => {
				console.log(data)
			})
			.catch(err => {
				console.error(err)
			})
	}

	return (
		<div>
			<div>
				<Link href="/">Back to home</Link>
			</div>
			<div>
				Login
			</div>
			<div>
				<input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button onClick={handleLogin}>Login</button>
			</div>
		</div>
	);
}