"use client"

import styles from "./styles.module.scss"
import { FileInput } from "@/app/components/ui/FileInput";
import { TextArea, TextInput } from "@/app/components/ui/TextInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/constants/file";
import { Entry } from "@/types/postcard";
import { getAuthHeader } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditEntry() {
	const { postcard, setPostcard, focusedEntry, setFocusedEntry } = usePostcard()
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	// Allow file or image url for reuploads
	const [image, setImage] = useState<File | string | null>(null)

	useEffect(() => {
		if (focusedEntry) {
			setTitle(focusedEntry.title)
			setDescription(focusedEntry.description)
			setImage(focusedEntry.imageUrl)
		}
	}, [focusedEntry])

	const handleFocusEntry = (entry: Entry) => {
		setFocusedEntry(entry)
	}

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
				setFocusedEntry(data.postcard.entries[data.postcard.entries.length - 1])
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

	const handleSubmitEntry = () => {
		ClientLogger.info('Submitting new entry')
		if (!postcard || !focusedEntry) {
			ClientLogger.error('No postcard or focused entry found')
			return
		}

		const formData = new FormData()
		formData.append('postcardId', postcard._id)
		formData.append('entryId', focusedEntry._id)
		formData.append('title', title)
		formData.append('description', description)
		if (image) {
			formData.append('file', image)
		}

		fetch('/api/postcard/entry/edit', {
			method: 'POST',
			body: formData,
			headers: getAuthHeader()
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Postcard created: ${JSON.stringify(data)}`)
				setPostcard(data.postcard)
			})
			.catch(err => {
				ClientLogger.error(`Error creating postcard: ${err}`)
			})
	}

	const handleDeleteEntry = () => {
		ClientLogger.info('Deleting entry')
		if (!postcard || !focusedEntry) {
			ClientLogger.error('No postcard or focused entry found')
			return
		}
		fetch('/api/postcard/entry/delete', {
			method: 'POST',
			body: JSON.stringify({ postcardId: postcard._id, entryId: focusedEntry._id }),
			headers: getAuthHeader()
		})
			.then(res => res.json())
			.then(data => {
				ClientLogger.info(`Entry deleted: ${JSON.stringify(data)}`)
				setPostcard(data.postcard)
			})
			.catch(err => {
				ClientLogger.error(`Error deleting entry: ${err}`)
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
							<button
								key={entry._id}
								onClick={() => handleFocusEntry(entry)}
								className={`${styles.entry} ${focusedEntry?._id === entry._id ? styles.focused : ''}`}
							>
								{entry.title.trim() || 'Untitled'}
							</button>
						))}
						<div>
							<button onClick={handleCreateEntry}>New entry</button>
						</div>
					</div>
				)}
			</div>
			<div>
				{focusedEntry ? (
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
								labelText={image ? 'File uploaded' : 'No file selected'}
								onChange={handleImageChange}
							/>
						</div>
						<div>
							<button onClick={handleSubmitEntry}>Submit</button>
						</div>
						<div>
							<button onClick={handleDeleteEntry}>Delete</button>
						</div>
					</div>
				) : (
					<div>
						{postcard?.entries.length ? (
							<p>
								No entry found. Create one to get started.
							</p>
						) : (
							<p>
								Select an entry to start editing.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
