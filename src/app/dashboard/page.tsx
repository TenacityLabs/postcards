"use client"

import { useUser } from "../context/userContext";

export default function Dashboard() {
	const { user, logout } = useUser()

	return (
		<div>
			hi {user?.email}
			<button onClick={logout}>Logout</button>
		</div>
	);
}
