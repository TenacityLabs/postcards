import styles from './folder.module.scss'
import { MONTHS } from "@/constants/date"
import { FOLDER_IMAGES } from "@/constants/postcard"
import { Postcard } from "@/types/postcard"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"

interface FolderProps {
	postcard: Postcard
}

export default function Folder(props: FolderProps) {
	const { postcard } = props

	const dateString = useMemo(() => {
		const dateObject = new Date(postcard.createdAt)
		const date = dateObject.getDate()
		const month = dateObject.getMonth()
		const year = dateObject.getFullYear()
		return `${MONTHS.TitleCase[month]} ${date}, ${year}`
	}, [postcard.createdAt])

	return (
		<div className={styles.container}>
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
		</div>
	)
}