import { usePostcard } from "@/app/context/postcardContext"
import styles from "./entry.module.scss"
import { Calendar } from "./calendar"
import { FileInput } from "./fileInput"
import { IMAGE_MIME_TYPES } from "@/constants/file"
import DeleteModal from "@/app/components/ui/DeleteModal"
import { useModal } from "@/app/context/modalContext"
import { useCallback } from "react"

interface EditPostcardEntryProps {
	onUploadEntryImage: (file: File) => void
	onDeleteEntryImage: (entryId: string) => void
	onDeleteEntry: (entryId: string) => void
}

export default function EditPostcardEntry(props: EditPostcardEntryProps) {
	const { onUploadEntryImage, onDeleteEntryImage, onDeleteEntry } = props
	const { focusedEntryId, focusedEntry, updateEntry } = usePostcard()
	const { updateModal, hideModal } = useModal()

	const handleOpenDeleteEntryModal = useCallback(() => {
		updateModal(<DeleteModal
			title="Delete entry"
			description="Are you sure you want to delete this entry? This action cannot be undone."
			hideModal={hideModal}
			handleDelete={() => {
				onDeleteEntry(focusedEntryId!)
				hideModal()
			}}
		/>)
	}, [focusedEntryId, onDeleteEntry, hideModal, updateModal])

	if (!focusedEntryId || !focusedEntry) {
		return null
	}

	return (
		<div className={styles.container}>
			<input
				placeholder="Entry title"
				value={focusedEntry.title}
				onChange={(e) => updateEntry(focusedEntryId, { title: e.target.value })}
				className={styles.titleInput}
			/>

			<Calendar />

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
				labelText={focusedEntry.imageUrl ? focusedEntry.imageName ?? "Unknown file" : 'Click here to upload an image.'}
				onUpload={onUploadEntryImage}
				onDelete={() => onDeleteEntryImage(focusedEntryId)}
				image={focusedEntry.imageUrl}
			/>

			<button
				className={styles.deleteEntryButton}
				onClick={handleOpenDeleteEntryModal}
			>
				Delete entry
			</button>
		</div>
	)
}
