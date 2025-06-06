"use client"

import { AxiosError } from 'axios'
import PlusCloudIcon from '../components/icons/PlusCloudIcon'
import styles from './folder.module.scss'
import Image from "next/image"
import { useState } from 'react'
import { showToast } from '../components/ui/CustomToast'
import { Status } from '../components/ui/StatusIndicator'
import { sendAPIRequest } from '@/utils/api'
import { APIEndpoints, APIMethods } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/userContext'

export default function EmptyFolder() {
	const router = useRouter()
	const { setUser } = useUser()
	const [creatingPostcard, setCreatingPostcard] = useState(false)

	const handleCreatePostcard = async () => {
		if (creatingPostcard) {
			return
		}

		try {
			setCreatingPostcard(true)
			const response = await sendAPIRequest(APIEndpoints.CreatePostcard, APIMethods.POST, undefined)
			showToast("Postcard created successfully", Status.Success)
			router.push(`/postcard/${response.postcardId}/edit`)

			// Wait for the user to be on the new path before updating the user state
			setTimeout(() => {
				setUser(prev => {
					if (!prev) {
						return null
					}
					return {
						...prev,
						postcards: response.postcards,
					}
				})
			}, 2000)
		} catch (error) {
			setCreatingPostcard(false)
			if (error instanceof AxiosError) {
				if (error.response?.data.message) {
					showToast(error.response?.data.message, Status.Error)
					return
				}
			}
			showToast("An error occurred while creating the postcard", Status.Error)
		}
	}

	return (
		<div className={styles.container}>
			<button
				className={styles.title}
				onClick={handleCreatePostcard}
			>
				Create a new Postcard
			</button>
			<button
				className={styles.folderButton}
				onClick={handleCreatePostcard}
			>
				<Image
					className={styles.folder}
					src='/images/folders/folder-empty.svg'
					alt="Empty Folder"
					width={300}
					height={200}
				/>
				<div className={styles.plusCloud}>
					<PlusCloudIcon width={64} height={64} />
				</div>
			</button>
		</div>
	)
}
