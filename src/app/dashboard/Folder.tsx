import styles from './folder.module.scss'
import { MONTHS } from "@/constants/date"
import { FOLDER_IMAGES } from "@/constants/postcard"
import { Postcard } from "@/types/postcard"
import Image from "next/image"
import { useCallback, useMemo } from "react"
import TrashIcon from '../components/icons/TrashIcon'
import { useRouter } from 'next/navigation'
import { useModal } from '../context/modalContext'
import { XIcon } from '../components/icons/XIcon'

interface FolderProps {
	postcard: Postcard
	isEditing: boolean
	handleDeletePostcard: () => void
}

export default function Folder(props: FolderProps) {
	const router = useRouter()
	const { updateModal, hideModal } = useModal()
	const { postcard, isEditing, handleDeletePostcard } = props

	const dateString = useMemo(() => {
		const dateObject = new Date(postcard.createdAt)
		const date = dateObject.getDate()
		const month = dateObject.getMonth()
		const year = dateObject.getFullYear()
		return `${MONTHS.TitleCase[month]} ${date}, ${year}`
	}, [postcard.createdAt])

	const handleDeletePostcardAndHideModal = useCallback(() => {
		handleDeletePostcard()
		hideModal()
	}, [handleDeletePostcard, hideModal])

	const deletePostcardModal = useMemo(() => {
		return (
			<div className={styles.deleteModal}>
				<div className={styles.header}>
					<h3>Delete Postcard</h3>
					<button className={styles.closeButton} onClick={hideModal}>
						<XIcon width={14} height={14} />
					</button>
				</div>
				<p className={styles.description}>
					Are you sure you want to delete this Postcard? <br />
					This action is permanent and cannot be undone.
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
	}, [hideModal, handleDeletePostcardAndHideModal])

	const handlePostcardClick = () => {
		if (isEditing) {
			updateModal(deletePostcardModal)
		} else {
			router.push(`/postcard/${postcard._id}/edit`)
		}
	}

	return (
		<div className={styles.container}>
			<button
				className={styles.title}
				onClick={handlePostcardClick}
			>
				{dateString}
			</button>
			<button
				className={styles.folderButton}
				onClick={handlePostcardClick}
			>
				<Image
					src={`/images/folders/${FOLDER_IMAGES[postcard.folderPattern]}`}
					alt="Folder"
					width={300}
					height={200}
				/>
				<div className={`${styles.trashIcon} ${isEditing ? styles.trashIconVisible : ''}`}>
					<TrashIcon width={64} height={64} />
				</div>
			</button>
		</div>
	)
}