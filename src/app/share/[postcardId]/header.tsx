import { usePostcard } from "@/app/context/postcardContext"
import styles from "./styles.module.scss"
import Image from "next/image"
import { numberToPrettyWeek } from "@/utils/date"
import Link from "next/link"
import { useUser } from "@/app/context/userContext"

export default function PostcardHeader() {
	const { user } = useUser()
	const { postcard, loading } = usePostcard()

	// This will never happen
	if (!loading && !postcard) {
		return null
	}

	return (
		<div className={styles.header}>
			{loading ? (
				<div className={styles.skeletonLogo} />
			) : (
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
			)}

			{loading ? (
				<>
					<div className={styles.skeletonDate}>
						MAY 20 - MAY 25, 2025
					</div>
					<h1 className={styles.skeletonTitle}>
						Lucas&apos;s <b>Postcard</b>
					</h1>
				</>
			) : (
				<>
					<div className={styles.date}>
						{numberToPrettyWeek(postcard!.createdAt)}
					</div>
					<h1 className={styles.title}>
						{postcard!.user.firstName} {postcard!.user.lastName}&apos;s <b>Postcard</b>
					</h1>
				</>
			)}
		</div>
	)
}

