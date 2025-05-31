import { usePostcard } from "@/app/context/postcardContext"
import styles from "./styles.module.scss"
import Image from "next/image"
import { numberToPrettyWeek } from "@/utils/date"

export default function PostcardHeader() {
	const { postcard } = usePostcard()

	// This will never happen
	if (!postcard) {
		return null
	}

	return (
		<div className={styles.header}>
			<div className={styles.headerLogo}>
				<Image
					src="/logos/postcards-logo-wide-64.svg"
					alt="Postcards"
					fill
				/>
			</div>

			<div className={styles.date}>
				{numberToPrettyWeek(postcard.createdAt)}
			</div>
			<h1 className={styles.title}>
				{postcard.user.firstName} {postcard.user.lastName}&apos;s <b>Postcard</b>
			</h1>
		</div>
	)
}

