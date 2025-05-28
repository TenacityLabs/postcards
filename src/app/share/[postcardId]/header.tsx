import { usePostcard } from "@/app/context/postcardContext"
import styles from "./styles.module.scss"

export default function PostcardHeader() {
	const { postcard } = usePostcard()

	// This will never happen
	if (!postcard) {
		return null
	}

	return (
		<div className={styles.header}>
			<div className={styles.date}>
				MAY 26 - MAY 31, 2025
			</div>
			<h1 className={styles.title}>
				{postcard.user.firstName} {postcard.user.lastName}&apos;s <b>Postcard</b>
			</h1>
		</div>
	)
}

