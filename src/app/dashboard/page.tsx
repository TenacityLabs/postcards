"use client"

import styles from './styles.module.scss'
import { useUser } from "../context/userContext";
import { ClientLogger } from "@/utils/clientLogger";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";
import Folder from './Folder';
import EmptyFolder from './EmptyFolder';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { showToast } from '../components/ui/CustomToast';
import { Status } from '../components/ui/StatusIndicator';
import EditIcon from '../components/icons/EditIcon';
import EditingIcon from '../components/icons/EditingIcon';

export default function Dashboard() {
	const { user, setUser, loading, logout } = useUser()
	const [isEditing, setIsEditing] = useState(false)

	const handleToggleEditing = useCallback(() => {
		if (isEditing) {
			setIsEditing(false)
			return
		}

		if (user?.postcards.length === 0) {
			showToast("You have no postcards to edit", Status.Error)
			return
		}

		setIsEditing(true)
	}, [user?.postcards.length, isEditing])

	const handleDeletePostcard = async (postcardId: string) => {
		try {
			// Optimistically update the user state
			setUser((prev) => {
				if (!prev) {
					return null
				}
				return {
					...prev,
					postcards: prev.postcards.filter((postcard) => postcard._id !== postcardId),
				}
			})

			const response = await sendAPIRequest(
				APIEndpoints.DeletePostcard,
				APIMethods.POST,
				{
					postcardId
				}
			)
			ClientLogger.info(`Postcard deleted: ${JSON.stringify(response)}`)
			showToast("Postcard deleted", Status.Success)
			setUser((prev) => {
				if (!prev) {
					return null
				}
				return {
					...prev,
					postcards: response.postcards,
				}
			})
			if (response.postcards.length === 0) {
				setIsEditing(false)
			}
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	if (loading || !user) {
		return null
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.header}>
					<Link href="/dashboard" className={styles.logoContainer}>
						<Image
							src="/logos/logo-128.svg"
							alt="Postcards"
							width={36}
							height={36}
						/>
						<h1>Postcards</h1>
					</Link>

					<div className={styles.headerBottom}>
						{loading ? (
							<div className={styles.skeletonHeader} />
						) : (
							<h1>
								Welcome back, {user?.firstName}
							</h1>
						)}

						<button onClick={handleToggleEditing} className={isEditing ? styles.editing : styles.edit}>
							<span className={styles.icon}>
								{isEditing ? (
									<EditingIcon width={20} height={20} />
								) : (
									<EditIcon width={20} height={20} />
								)}
							</span>
							<span className={styles.text}>
								Edit
							</span>
						</button>
					</div>
				</div>

				<div className={styles.foldersGrid}>
					<EmptyFolder />
					{user?.postcards.map((postcard) => (
						<Folder
							key={postcard._id}
							postcard={postcard}
							isEditing={isEditing}
							handleDeletePostcard={() => handleDeletePostcard(postcard._id)}
						/>
					))}
				</div>

				<div className={styles.logoutButtonContainer}>
					<button onClick={logout} className={styles.logoutButton}>
						Logout
					</button>
				</div>

			</div>
		</div>
	);
}
