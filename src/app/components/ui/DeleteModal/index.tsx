import TrashIcon from "../../icons/TrashIcon"
import { XIcon } from "../../icons/XIcon"
import styles from "./styles.module.scss"

interface DeleteModalProps {
	title: string
	description: string
	hideModal: () => void
	handleDeletePostcardAndHideModal: () => void
}

export default function DeleteModal(props: DeleteModalProps) {
	const { title, description, hideModal, handleDeletePostcardAndHideModal } = props
	return (
		<div className={styles.deleteModal}>
			<div className={styles.header}>
				<h3>{title}</h3>
				<button className={styles.closeButton} onClick={hideModal}>
					<XIcon width={14} height={14} />
				</button>
			</div>
			<p className={styles.description}>
				{description}
			</p>

			<button
				className={styles.deleteButton}
				onClick={handleDeletePostcardAndHideModal}
			>
				<span className={styles.label}>
					Yes, delete
				</span>
				<TrashIcon width={22} height={22} />
			</button>
		</div>
	)
}