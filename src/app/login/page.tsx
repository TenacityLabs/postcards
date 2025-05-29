"use client"

import Link from "next/link";
import { useState } from "react";
import { LOCALSTORAGE_JWT_KEY } from "../../constants/auth";
import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";

export default function Login() {
	const { setUser } = useUser()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = async () => {
		try {
			const response = await sendAPIRequest(
				APIEndpoints.Login,
				APIMethods.POST,
				{
					email,
					password
				}
			)
			localStorage.setItem(LOCALSTORAGE_JWT_KEY, response.token)
			setUser(response.user)
			ClientLogger.info('Login successful')
		} catch (error) {
			ClientLogger.error(error)
		}
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