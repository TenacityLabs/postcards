"use client"

import { DateInput } from "@/app/components/ui/DateInput";
import styles from "./styles.module.scss"
import { FileInput } from "@/app/components/ui/FileInput";
import { TextArea, TextInput } from "@/app/components/ui/TextInput";
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

export default function EditEntry() {
	const { user, loading: userLoading } = useUser()
	const { postcard, loading: postcardLoading, setPostcard, focusedEntry, setFocusedEntry } = usePostcard()
	const router = useRouter()
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
				handleCreateEntry={handleCreateEntry}
			/>

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
