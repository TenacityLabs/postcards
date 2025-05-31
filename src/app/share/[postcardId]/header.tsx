import { usePostcard } from "@/app/context/postcardContext"
import styles from "./styles.module.scss"
import Image from "next/image"
import { numberToPrettyWeek } from "@/utils/date"
import Link from "next/link"
import { useUser } from "@/app/context/userContext"

export default function PostcardHeader() {
	const { user } = useUser()
	const { postcard } = usePostcard()

	// This will never happen
	if (!postcard) {
		return null
	}

	return (
		<div className={styles.header}>
			<Link
				href={user ? "/dashboard" : "/"}
				className={styles.headerLogo}
			>
				<Image
					src="/logos/postcards-logo-wide-64.svg"
					alt="Postcards"
					fill
				/>
			</Link>

			<div className={styles.date}>
				{numberToPrettyWeek(postcard.createdAt)}
			</div>
			<h1 className={styles.title}>
				{postcard.user.firstName} {postcard.user.lastName}&apos;s <b>Postcard</b>
			</h1>
		</div>
	)
}

