"use client"

import Link from "next/link";
import { useState } from "react";
import { LOCALSTORAGE_JWT_KEY } from "../../constants/auth";
import { ClientLogger } from "@/utils/clientLogger";
import { useUser } from "../context/userContext";
import { APIMethods } from "@/types/api";
import { APIEndpoints } from "@/types/api";
import { sendAPIRequest } from "@/utils/api";

export default function Signup() {
	const { setUser } = useUser()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')

	const handleSignup = async () => {
		try {
			const response = await sendAPIRequest(
				APIEndpoints.Signup,
				APIMethods.POST,
				{ email, password, firstName, lastName }
			)
			localStorage.setItem(LOCALSTORAGE_JWT_KEY, response.token)
			setUser(response.user)
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
				Signup
			</div>
			<div>
				<input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			</div>
			<div>
				<input placeholder="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
				<input placeholder="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
			</div>
			<div>
				<button onClick={handleSignup}>Signup</button>
			</div>

		</div>
	);
}