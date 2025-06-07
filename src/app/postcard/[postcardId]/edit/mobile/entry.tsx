import { usePostcard } from "@/app/context/postcardContext"
import styles from "./entry.module.scss"

interface EditPostcardEntryProps {
}

export default function EditPostcardEntry(props: EditPostcardEntryProps) {
	const { focusedEntryId, focusedEntry, updateEntry } = usePostcard()

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
		</div>
	)
}
