"use client"

import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { getAuthHeader } from "@/utils/api";

export default function Dashboard() {
	const { user, logout } = useUser()

	const handleCreatePostcard = async () => {
		fetch('/api/postcard/new', {
			method: 'POST',
			headers: getAuthHeader(),
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Postcard created: ${JSON.stringify(data)}`)
			})
			.catch(err => {
				ClientLogger.error(`Error creating postcard: ${err}`)
			})
	}

	return (
		<div>
			<div>
				Hi {user?.email}
			</div>
			<div>
				<button onClick={logout}>Logout</button>
			</div>
			<div>
				<button onClick={handleCreatePostcard}>Create New</button>
			</div>
		</div>
	);
}
