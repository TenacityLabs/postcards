"use client"

import Link from "next/link";
import { useState } from "react";
import { LOCALSTORAGE_JWT_KEY } from "../constants/auth";

export default function Signup() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSignup = () => {
		fetch('/api/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		})
			.then(res => res.json())
			.then(data => {
				console.log(data)
				localStorage.setItem(LOCALSTORAGE_JWT_KEY, data.token)
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
				Signup
			</div>
			<div>
				<input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button onClick={handleSignup}>Signup</button>
			</div>
		</div>
	);
}