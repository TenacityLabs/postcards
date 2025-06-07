"use client"

import styles from "./styles.module.scss"
import { FileInput } from "./fileInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES } from "@/constants/file";
import { useUser } from "@/app/context/userContext";
import { Navigation } from "./navigation";
import { Calendar } from "./calendar";

interface EditEntryDesktopProps {
	onCreateEntry: () => void
	onDeleteEntry: (entryId: string) => void
	onUploadEntryImage: (file: File) => void
	onDeleteEntryImage: () => void
}

export default function EditEntryDesktop(props: EditEntryDesktopProps) {
	const { onCreateEntry, onDeleteEntry, onUploadEntryImage, onDeleteEntryImage } = props
	const { user } = useUser()
	const { postcard, focusedEntryId, focusedEntry, updateEntry } = usePostcard()

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

