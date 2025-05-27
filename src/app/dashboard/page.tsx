"use client"

import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { getAuthHeader } from "@/utils/api";
import Link from "next/link";

export default function Dashboard() {
	const { user, logout } = useUser()

	const handleCreatePostcard = async () => {
		fetch('/api/postcard/create', {
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

			{user?.postcards.map((postcard) => (
				<div key={postcard._id}>
					<Link href={`/postcard/${postcard._id}/edit`}>
						Postcard {new Date(postcard.createdAt).toLocaleDateString()}
					</Link>
				</div>
			))}
		</div>
	);
}
