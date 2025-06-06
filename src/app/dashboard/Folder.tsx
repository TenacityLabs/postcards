import styles from './folder.module.scss'
import { MONTHS } from "@/constants/date"
import { FOLDER_IMAGES } from "@/constants/postcard"
import { Postcard } from "@/types/postcard"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import TrashIcon from '../components/icons/TrashIcon'

interface FolderProps {
	postcard: Postcard
	isEditing: boolean
	handleDeletePostcard: () => void
}

export default function Folder(props: FolderProps) {
	const { postcard, isEditing, handleDeletePostcard } = props

	const dateString = useMemo(() => {
		const dateObject = new Date(postcard.createdAt)
		const date = dateObject.getDate()
		const month = dateObject.getMonth()
		const year = dateObject.getFullYear()
		return `${MONTHS.TitleCase[month]} ${date}, ${year}`
	}, [postcard.createdAt])

	return (
		<div className={styles.container}>
			{isEditing ? (
				<>
					<button
						className={styles.title}
						onClick={handleDeletePostcard}
					>
						{dateString}
					</button>
					<button
						className={styles.folderButton}
						onClick={handleDeletePostcard}
					>
						<Image
							src={`/images/folders/${FOLDER_IMAGES[postcard.folderPattern]}`}
							alt="Folder"
							width={300}
							height={200}
						/>
						<div className={styles.trashIcon}>
							<TrashIcon width={64} height={64} />
						</div>
					</button>
				</>
			) : (
				<>
					<Link
						href={`/postcard/${postcard._id}/edit`}
						className={styles.title}
					>
						{dateString}
					</Link>
					<Link
						href={`/postcard/${postcard._id}/edit`}
						className={styles.folderButton}
					>
						<Image
							src={`/images/folders/${FOLDER_IMAGES[postcard.folderPattern]}`}
							alt="Folder"
							width={300}
							height={200}
						/>
					</Link>
				</>
			)}
		</div>
	)
}