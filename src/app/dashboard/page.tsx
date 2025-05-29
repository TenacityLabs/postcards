"use client"

import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { sendAPIRequest } from "@/utils/api";
import Link from "next/link";
import { APIEndpoints, APIMethods } from "@/types/api";

export default function Dashboard() {
	const { user, setUser, logout } = useUser()

	const handleCreatePostcard = async () => {
		try {
			const response = await sendAPIRequest(
				APIEndpoints.CreatePostcard,
				APIMethods.POST,
				undefined
			)
			ClientLogger.info(`Postcard created: ${JSON.stringify(response)}`)
			setUser((prev) => {
				if (!prev) {
					return null
				}
				return {
					...prev,
					postcards: response.postcards,
				}
			})
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	const handleDeletePostcard = async (postcardId: string) => {
		try {
			const response = await sendAPIRequest(
				APIEndpoints.DeletePostcard,
				APIMethods.POST,
				{
					postcardId
				}
			)
			ClientLogger.info(`Postcard deleted: ${JSON.stringify(response)}`)
			setUser((prev) => {
				if (!prev) {
					return null
				}
				return {
					...prev,
					postcards: response.postcards,
				}
			})
		} catch (error) {
			ClientLogger.error(error)
		}
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
