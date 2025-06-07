"use client"

import styles from "./styles.module.scss"
import { FileInput } from "./fileInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES } from "@/constants/file";
import { useUser } from "@/app/context/userContext";
import { Navigation } from "./navigation";
import { Calendar } from "./calendar";
import { useEffect } from "react";
import Image from "next/image";

interface EditPostcardDesktopProps {
	onCreateEntry: () => void
	onDeleteEntry: (entryId: string) => void
	onUploadEntryImage: (file: File) => void
	onDeleteEntryImage: () => void
}

export default function EditPostcardDesktop(props: EditPostcardDesktopProps) {
	const { onCreateEntry, onDeleteEntry, onUploadEntryImage, onDeleteEntryImage } = props
	const { user } = useUser()
	const { postcard, focusedEntryId, focusedEntry, setFocusedEntryId, updateEntry } = usePostcard()

	useEffect(() => {
		if (postcard && postcard.entries.length > 0 && !focusedEntryId) {
			setFocusedEntryId(postcard.entries[0]._id)
		}
	}, [postcard, focusedEntryId, setFocusedEntryId])

	if (!postcard || !user) {
		return null
	}

	return (
		<div className={styles.page}>
			<Navigation
				onCreateEntry={onCreateEntry}
				onDeleteEntry={onDeleteEntry}
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
							onUpload={onUploadEntryImage}
							onDelete={onDeleteEntryImage}
							image={focusedEntry.imageUrl}
						/>
					</>
				) : (
					<div className={styles.emptyEntryCenter}>
						<div className={styles.emptyEntryContainer}>
							{postcard?.entries.length ? (
								<p>
									Select an entry to start editing.
								</p>
							) : (
								<>
									<p>
										No entry found. Create one to get started.
									</p>

									<button
										className={styles.createEntryButton}
										onClick={onCreateEntry}
									>
										Add a new entry
									</button>
								</>
							)}

							<Image
								src="/images/empty-letter.png"
								alt="Empty entry"
								width={643}
								height={466}
								priority
								className={styles.emptyLetterImage}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

