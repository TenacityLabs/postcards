"use client"

import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { getAuthHeader } from "@/utils/api";
import Link from "next/link";

export default function Dashboard() {
	const { user, setUser, logout } = useUser()

	const handleCreatePostcard = async () => {
		fetch('/api/postcard/create', {
			method: 'POST',
			headers: getAuthHeader(),
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Postcard created: ${JSON.stringify(data)}`)
				setUser((prev) => {
					if (!prev) {
						return null
					}
					return {
						...prev,
						postcards: data.postcards,
					}
				})
			})
			.catch(err => {
				ClientLogger.error(`Error creating postcard: ${err}`)
			})
	}

	const handleDeletePostcard = async (postcardId: string) => {
		fetch(`/api/postcard/delete`, {
			method: 'POST',
			headers: getAuthHeader(),
			body: JSON.stringify({ postcardId }),
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Postcard deleted: ${JSON.stringify(data)}`)
				setUser((prev) => {
					if (!prev) {
						return null
					}
					return {
						...prev,
						postcards: data.postcards,
					}
				})
			})
			.catch(err => {
				ClientLogger.error(`Error deleting postcard: ${err}`)
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

					<button onClick={() => handleDeletePostcard(postcard._id)}>Delete</button>
				</div>
			))}
		</div>
	);
}
