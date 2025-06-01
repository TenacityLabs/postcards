"use client"

import { DateInput } from "@/app/components/ui/DateInput";
import styles from "./styles.module.scss"
import { FileInput } from "@/app/components/ui/FileInput";
import { TextArea, TextInput } from "@/app/components/ui/TextInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE } from "@/constants/file";
import { Entry, PostcardDate } from "@/types/postcard";
import { sendAPIRequest } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import Link from "next/link";
import { useEffect, useState } from "react";
import { POSTCARD_SHARE_LINK_PREFIX } from "@/constants/postcard";
import { APIEndpoints } from "@/types/api";
import { APIMethods } from "@/types/api";

export default function EditEntry() {
	const { postcard, setPostcard, focusedEntry, setFocusedEntry } = usePostcard()
	const [title, setTitle] = useState('')
	const [date, setDate] = useState<PostcardDate | null>(null)
	const [description, setDescription] = useState('')
	// Allow file or image url for reuploads
	const [image, setImage] = useState<File | string | null>(null)

	useEffect(() => {
		if (focusedEntry) {
			setTitle(focusedEntry.title)
			setDate(focusedEntry.date)
			setDescription(focusedEntry.description)
			setImage(focusedEntry.imageUrl)
		}
	}, [focusedEntry])

	useEffect(() => {
		// Handler to support pasting images from clipboard
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			for (const item of items) {
				if (item.type.startsWith("image/")) {
					if (!IMAGE_MIME_TYPES.includes(item.type)) {
						ClientLogger.error(`Invalid file type: ${item.type}. Expected one of: ${IMAGE_MIME_TYPES.join(", ")}`)
						return
					}
					const file = item.getAsFile();
					if (file) {
						ClientLogger.info("Image pasted from clipboard");
						handleImageChange(file);
						break;
					}
				}
			}
		};

		window.addEventListener("paste", handlePaste);
		return () => {
			window.removeEventListener("paste", handlePaste);
		};
	}, []);

	const handleFocusEntry = (entry: Entry) => {
		setFocusedEntry(entry)
	}

	const handleCreateEntry = async () => {
		ClientLogger.info('Creating new entry')
		if (!postcard) {
			ClientLogger.error('No postcard found')
			return
		}
		try {
			const response = await sendAPIRequest(
				APIEndpoints.CreateEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id
				}
			)
			ClientLogger.info(`Entry created: ${JSON.stringify(response)}`)
			setPostcard(response.postcard)
			if (response.postcard.entries.length > 0) {
				setFocusedEntry(response.postcard.entries[response.postcard.entries.length - 1])
			} else {
				setFocusedEntry(null)
			}
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	const handleCopyShareLink = () => {
		navigator.clipboard.writeText(`${POSTCARD_SHARE_LINK_PREFIX}${postcard?._id}`)
	}

	const handleImageChange = (file: File | null) => {
		if (!file) {
			setImage(null)
			return
		}
		if (!IMAGE_MIME_TYPES.includes(file.type)) {
			ClientLogger.error(`Invalid file type: ${file.type}`)
			return
		}
		if (file.size > MAX_IMAGE_SIZE) {
			ClientLogger.error(`File size too large: ${file.size}`)
			return
		}
		setImage(file)
	}

	const handleSubmitEntry = async () => {
		ClientLogger.info('Submitting new entry')
		if (!postcard || !focusedEntry) {
			ClientLogger.error('No postcard or focused entry found')
			return
		}

		try {
			const response = await sendAPIRequest(
				APIEndpoints.EditEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntry._id,
					title,
					description,
					file: image,
					date: date ? date.toString() : null
				}
			)
			ClientLogger.info(`Postcard created: ${JSON.stringify(response)}`)
			setPostcard(response.postcard)
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	const handleDeleteEntry = async () => {
		ClientLogger.info('Deleting entry')
		if (!postcard || !focusedEntry) {
			ClientLogger.error('No postcard or focused entry found')
			return
		}
		try {
			const response = await sendAPIRequest(
				APIEndpoints.DeleteEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntry._id
				}
			)
			ClientLogger.info(`Entry deleted: ${JSON.stringify(response)}`)
			setPostcard(response.postcard)
		} catch (error) {
			ClientLogger.error(error)
		}
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
						<div>
							<button onClick={handleCopyShareLink}>Copy share link</button>
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
							<DateInput
								selectedDate={date}
								setSelectedDate={setDate}
								clearSelectedDate={() => setDate(null)}
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
								accept={IMAGE_MIME_TYPES.join(',')}
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
