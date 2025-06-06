"use client"

import styles from './styles.module.scss'
import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";
import Folder from './Folder';
import EmptyFolder from './EmptyFolder';

export default function Dashboard() {
	const { user, setUser, loading, logout } = useUser()

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

	if (loading || !user) {
		return null
	}

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				{loading ? (
					<div className={styles.skeletonHeader} />
				) : (
					<h1>
						Welcome back, {user?.firstName}
					</h1>
				)}
			</div>

			<div>
				<button onClick={logout}>Logout</button>
			</div>
			<div>
				<button onClick={handleCreatePostcard}>Create New</button>
			</div>

			{user?.postcards.map((postcard) => (
				<div key={postcard._id}>
					<button onClick={() => handleDeletePostcard(postcard._id)}>Delete</button>
				</div>
			))}

			<div className={styles.foldersGrid}>
				<EmptyFolder />
				{user?.postcards.map((postcard) => (
					<Folder
						key={postcard._id}
						postcard={postcard}
					/>
				))}
			</div>
		</div>
	);
}
