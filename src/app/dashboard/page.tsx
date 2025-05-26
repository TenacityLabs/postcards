"use client"

import Link from "next/link";
import { useUser } from "../context/userContext";

export default function Dashboard() {
	const { user, logout } = useUser()

	return (
		<div>
			<div>
				Hi {user?.email}
			</div>
			<div>
				<button onClick={logout}>Logout</button>
			</div>
			<div>
				<Link href="/create/new">Create New</Link>
			</div>
		</div>
	);
}
