"use client"

import styles from "./styles.module.scss"
import { FileInput } from "@/app/postcard/[postcardId]/edit/fileInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, PREFERRED_IMAGE_QUALITY, PREFERRED_MAX_WIDTH } from "@/constants/file";
import { sendAPIRequest } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import { useCallback, useEffect } from "react";
import { APIEndpoints } from "@/types/api";
import { APIMethods } from "@/types/api";
import { compressImageToJPEG } from "@/utils/file";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import { Navigation } from "./navigation";
import { Calendar } from "./calendar";

export default function EditEntry() {
	const { user, loading: userLoading } = useUser()
	const { postcard, setPostcard, loading: postcardLoading, focusedEntryId, setFocusedEntryId, focusedEntry, updateEntry } = usePostcard()
	const router = useRouter()

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

	const handleCreateEntry = useCallback(async () => {
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
			setPostcard(prevPostcard => {
				if (!prevPostcard) {
					return null
				}
				return {
					...prevPostcard,
					entries: [...prevPostcard.entries, response.entry]
				}
			})
			setFocusedEntryId(response.entry._id)
		} catch (error) {
			ClientLogger.error(error)
		}
	}, [postcard, setFocusedEntryId, setPostcard])

	const handleUploadEntryImage = useCallback(async (file: File) => {
		ClientLogger.info('Uploading entry image')
		if (!focusedEntryId || !postcard) {
			ClientLogger.error('No focused entry or postcard found')
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

			const response = await sendAPIRequest(
				APIEndpoints.UploadEntryImage,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntryId,
					image: compressedFile,
					imageName: file.name,
				}
			)
			updateEntry(focusedEntryId, {
				imageUrl: response.imageUrl,
				imageName: response.imageName,
			})
		} catch (error) {
			console.log(error)
			ClientLogger.error(JSON.stringify(error))
		}
	}, [focusedEntryId, postcard, updateEntry])

	const handleDeleteEntryImage = useCallback(async () => {
		ClientLogger.info('Deleting entry image')
		if (!focusedEntryId || !postcard) {
			ClientLogger.error('No focused entry or postcard found')
			return
		}

		try {
			await sendAPIRequest(
				APIEndpoints.DeleteEntryImage,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntryId,
				}
			)
			updateEntry(focusedEntryId, {
				imageUrl: null,
				imageName: null,
			})
		} catch (error) {
			ClientLogger.error(JSON.stringify(error))
		}
	}, [focusedEntryId, postcard, updateEntry])

	const handleDeleteEntry = useCallback(async (entryId: string) => {
		ClientLogger.info('Deleting entry')
		if (!postcard) {
			ClientLogger.error('No postcard found')
			return
		}
		try {
			await sendAPIRequest(
				APIEndpoints.DeleteEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId,
				}
			)
			setPostcard(prevPostcard => {
				if (!prevPostcard) {
					return null
				}
				return {
					...prevPostcard,
					entries: prevPostcard.entries.filter(entry => entry._id !== entryId),
				}
			})
		} catch (error) {
			ClientLogger.error(error)
		}
	}, [postcard, setPostcard])

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
						handleUploadEntryImage(file);
						break;
					}
				}
			}
		};

		window.addEventListener("paste", handlePaste);
		return () => {
			window.removeEventListener("paste", handlePaste);
		};
	}, [handleUploadEntryImage]);

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault(); // Necessary to allow dropping
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer?.files?.length) return;
			const file = e.dataTransfer.files[0];
			ClientLogger.info("Image dropped onto page");
			handleUploadEntryImage(file);
		};

		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("drop", handleDrop);

		return () => {
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("drop", handleDrop);
		};
	}, [handleUploadEntryImage]);

	if (!postcard || !user) {
		return null
	}

	return (
		<div className={styles.page}>
			<Navigation
				onCreateEntry={handleCreateEntry}
				onDeleteEntry={handleDeleteEntry}
			/>

			<div className={styles.content}>
				{focusedEntryId && focusedEntry ? (
					<>
						<div className={styles.title}>
							<input
								placeholder="Title"
								value={focusedEntry.title}
								onChange={(e) => updateEntry(focusedEntryId, { title: e.target.value })}
								className={styles.titleInput}
							/>

							<Calendar />
						</div>

						<div className={styles.textAreaContainer}>
							<textarea
								value={focusedEntry.description}
								onChange={(e) => updateEntry(focusedEntryId, { description: e.target.value })}
								placeholder="Write text or paste a link here"
								className={styles.textArea}
								maxLength={500}
							/>
							<div
								className={`${styles.textAreaLength} ${focusedEntry.description.length >= 500 ?
									styles.errorLength : focusedEntry.description.length >= 450 ? styles.warningLength : ''}`}
							>
								{focusedEntry.description.length}/500 CHARACTERS
							</div>
						</div>

						<FileInput
							label="Upload File"
							accept={IMAGE_MIME_TYPES.join(',')}
							labelText={focusedEntry.imageUrl ? focusedEntry.imageName ?? "Unknown file" : 'Click or drag to upload here.'}
							onUpload={handleUploadEntryImage}
							onDelete={handleDeleteEntryImage}
							image={focusedEntry.imageUrl}
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
			<FileDropOverlay visible={true} />
		</div>
	)
}
