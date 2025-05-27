"use client"

import styles from "./styles.module.scss"
import { FileInput } from "@/app/components/ui/FileInput";
import { TextArea, TextInput } from "@/app/components/ui/TextInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/constants/file";
import { getAuthHeader } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import Link from "next/link";
import { useState } from "react";

export default function EditEntry() {
	const { postcard, setPostcard } = usePostcard()
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState<File | null>(null)

	const handleCreateEntry = () => {
		ClientLogger.info('Creating new entry')
		if (!postcard) {
			ClientLogger.error('No postcard found')
			return
		}
		fetch('/api/postcard/entry/create', {
			method: 'POST',
			body: JSON.stringify({ postcardId: postcard._id }),
			headers: getAuthHeader()
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Entry created: ${JSON.stringify(data)}`)
				setPostcard(data.postcard)
			})
			.catch(err => {
				ClientLogger.error(`Error creating entry: ${err}`)
			})
	}

	const handleImageChange = (file: File | null) => {
		if (!file) {
			setImage(null)
			return
		}
		if (!IMAGE_TYPES.includes(file.type)) {
			ClientLogger.error(`Invalid file type: ${file.type}`)
			return
		}
		if (file.size > MAX_IMAGE_SIZE) {
			ClientLogger.error(`File size too large: ${file.size}`)
			return
		}
		setImage(file)
	}

	const handleSubmit = () => {
		ClientLogger.info('Submitting new entry')

		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('file', image as File)

		fetch('/api/postcard/create', {
			method: 'POST',
			body: formData,
			headers: getAuthHeader()
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Postcard created: ${data}`)
			})
			.catch(err => {
				ClientLogger.error(`Error creating postcard: ${err}`)
			})
	}

	return (
		<div className={styles.container}>
			<div>
				<Link href="/dashboard">Dashboard</Link>
				{postcard && (
					<div>
						<h4>{new Date(postcard.createdAt).toLocaleString()}</h4>
						{postcard.entries.map((entry) => (
							<div key={entry._id}>
								<h4>{entry.title.trim() || 'Untitled'}</h4>
							</div>
						))}
						<div>
							<button onClick={handleCreateEntry}>New entry</button>
						</div>
					</div>
				)}
			</div>
			<div>
				<div>
					<TextInput
						placeholder="Title"
						value={title}
						setValue={setTitle}
					/>
				</div>
				<div>
					<TextArea
						placeholder="Description"
						value={description}
						setValue={setDescription}
						rows={10}
						maxLength={500}
					/>
				</div>
				<div>
					<FileInput
						label="Upload File"
						accept={IMAGE_TYPES.join(',')}
						file={image}
						onChange={handleImageChange}
					/>
				</div>
				<div>
					<button onClick={handleSubmit}>Submit</button>
				</div>
			</div>
		</div>
	)
}
