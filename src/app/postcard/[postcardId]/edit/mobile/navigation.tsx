import { usePostcard } from "@/app/context/postcardContext"
import styles from "./navigation.module.scss"

interface EditEntryNavigationProps {
	onCreateEntry: () => void
}

export default function EditEntryNavigation(props: EditEntryNavigationProps) {
	const { onCreateEntry } = props
	const { postcard, setFocusedEntryId } = usePostcard()

	return (
		<div className={styles.entriesContainer}>
			<h3>
				TABLE OF CONTENTS
			</h3>

			<div className={styles.entries}>
				{postcard?.entries.map(entry => (
					<button
						key={entry._id}
						className={styles.entry}
						onClick={() => setFocusedEntryId(entry._id)}
					>
						{entry.title || "Untitled"}
					</button>
				))}

				<button
					className={styles.addEntry}
					onClick={onCreateEntry}
				>
					+ Add new entry
				</button>
			</div>
		</div>
	)
}