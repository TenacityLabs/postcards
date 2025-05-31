import Image from "next/image"
import styles from "./styles.module.scss"
import { usePostcard } from "@/app/context/postcardContext"
import { numberToPrettyWeek } from "@/utils/date"
import Link from "next/link"
import { useUser } from "@/app/context/userContext"
interface PostcardSummaryProps {
	showPostcard: () => void
}

export default function PostcardSummary(props: PostcardSummaryProps) {
	const { showPostcard } = props
	const { user } = useUser()
	const { postcard, loading } = usePostcard()

	if (loading) {
		return null
	}

	if (!postcard) {
		return null
	}

	return (
		<div className={styles.summaryContainer}>
			<div className={styles.summary}>
				<Link
					href={user ? "/dashboard" : "/"}
					className={styles.summaryLogo}
				>
					<Image
						src="/logos/postcards-logo-wide-64.svg"
						alt="Postcards"
						fill
					/>
				</Link>
				<div className={styles.summaryTitle}>
					<div className={styles.date}>
						{numberToPrettyWeek(postcard?.createdAt ?? 0)}
					</div>
					<div className={styles.title}>
						You&apos;ve Received <br />
						<b>
							{postcard?.user.firstName}&apos;s Postcard
						</b>
					</div>
				</div>

				<div>
					<button
						className={styles.summaryNextButton}
						onClick={showPostcard}
					>
						LET&apos;S GO →
					</button>

				</div>
			</div>
		</div>
	)
}
