"use client"

import styles from "./styles.module.scss"
import { FileInput } from "@/app/components/ui/FileInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, PREFERRED_IMAGE_QUALITY, PREFERRED_MAX_WIDTH } from "@/constants/file";
import { Entry, PostcardDate } from "@/types/postcard";
import { sendAPIRequest } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import { useEffect, useState } from "react";
import { APIEndpoints } from "@/types/api";
import { APIMethods } from "@/types/api";
import { compressImageToJPEG } from "@/utils/file";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import { Navigation } from "./navigation";
import CalendarIcon from "@/app/components/icons/CalendarIcon";

export default function EditEntry() {
	const { user, loading: userLoading } = useUser()
	const { postcard, loading: postcardLoading, setPostcard, focusedEntry, setFocusedEntry } = usePostcard()
	const router = useRouter()
	const [title, setTitle] = useState('')
	const [date, setDate] = useState<PostcardDate | null>(null)
	const [description, setDescription] = useState('')
	// Allow file or image url for reuploads
	const [image, setImage] = useState<File | string | null>(null)
	const [entriesToSave, setEntriesToSave] = useState<Record<string, NodeJS.Timeout | null>>({})

	useEffect(() => {
		if (focusedEntry) {
			setTitle(focusedEntry.title)
			setDate(focusedEntry.date)
			setDescription(focusedEntry.description)
			setImage(focusedEntry.imageUrl)
		}
	}, [focusedEntry])

	useEffect(() => {
		if (userLoading || postcardLoading) {
			return
		}
		if (!user || !postcard) {
			ClientLogger.error('No user or postcard found')
			router.push('/dashboard')
			return
		}
	}, [userLoading, postcardLoading, user, postcard, router])

	useEffect(() => {
		// Handler to support pasting images from clipboard
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			for (const item of items) {
				if (item.type.startsWith("image/")) {
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

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault(); // Necessary to allow dropping
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer?.files?.length) return;
			const file = e.dataTransfer.files[0];
			ClientLogger.info("Image dropped onto page");
			handleImageChange(file);
		};

		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("drop", handleDrop);

		return () => {
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("drop", handleDrop);
		};
	}, []);

	useEffect(() => {
		if (!focusedEntry) {
			return
		}

		console.log(title, date, description)

	}, [title, date, description, focusedEntry])

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

	const handleImageChange = async (file: File | null) => {
		ClientLogger.info(`Image uploaded with size: ${file ? file.size : 'null'}`)
		if (!file) {
			setImage(null)
			return
		}
		if (!IMAGE_MIME_TYPES.includes(file.type)) {
			ClientLogger.error(`Invalid file type: ${file.type}`)
			return
		}

		try {
			const compressedFile = await compressImageToJPEG(file, PREFERRED_MAX_WIDTH, PREFERRED_IMAGE_QUALITY)
			ClientLogger.info(`Compressed file to size: ${compressedFile?.size}`)
			if (!compressedFile) {
				ClientLogger.error('Failed to compress image')
				return
			}
			if (compressedFile.size > MAX_IMAGE_SIZE) {
				ClientLogger.error(`File size too large even after compression: ${file.size}`)
				return
			}
			setImage(compressedFile)
		} catch (error) {
			ClientLogger.error(JSON.stringify(error))
		}
	}

	const handleDeleteEntry = async (entryId: string) => {
		ClientLogger.info('Deleting entry')
		if (!postcard) {
			ClientLogger.error('No postcard found')
			return
		}
		try {
			const response = await sendAPIRequest(
				APIEndpoints.DeleteEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId,
				}
			)
			setPostcard(response.postcard)
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	if (!postcard || !user) {
		return null
	}

	return (
		<div className={styles.page}>
			<Navigation
				handleFocusEntry={handleFocusEntry}
				focusedEntry={focusedEntry}
				onCreateEntry={handleCreateEntry}
				onDeleteEntry={handleDeleteEntry}
			/>

			<div className={styles.content}>
				{focusedEntry ? (
					<>
						<div className={styles.title}>
							<input
								placeholder="Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className={styles.titleInput}
							/>

							<button className={styles.calendarButton}>
								<CalendarIcon width={36} height={36} />
							</button>
						</div>

						<div className={styles.textAreaContainer}>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Write text or paste a link here"
								className={styles.textArea}
								maxLength={500}
							/>
							<div className={styles.textAreaLength}>
								{description.length}/500 CHARACTERS
							</div>
						</div>

						<FileInput
							label="Upload File"
							accept={IMAGE_MIME_TYPES.join(',')}
							labelText={image ? 'luppy.png' : 'Click or drag to upload here.'}
							onUpload={handleImageChange}
							onDelete={() => handleImageChange(null)}
							image={image}
						/>
					</>
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
