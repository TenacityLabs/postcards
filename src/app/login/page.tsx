"use client"

import Link from "next/link";
import { useState } from "react";
import { LOCALSTORAGE_JWT_KEY } from "../../constants/auth";
import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";

export default function Login() {
	const { setUser } = useUser()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = () => {
		fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		})
			.then(res => res.json())
			.then(data => {
				localStorage.setItem(LOCALSTORAGE_JWT_KEY, data.token)
				setUser(data.user)
			})
			.catch(err => {
				ClientLogger.error(err)
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