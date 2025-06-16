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

	if (!loading && !postcard) {
		return null
	}

	return (
		<div className={styles.summaryContainer}>
			<div className={styles.summary}>
				{loading ? (
					<div className={styles.skeletonLogo} />
				) : (
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
				)}
				<div className={styles.summaryTitle}>
					{loading ? (
						<>
							<div className={styles.skeletonDate}>
								Unknown - Unknown, Unknown
							</div>
							<div className={styles.skeletonTitle}>
								You&apos;ve Received <br />
								<b>
									Unknown&apos;s Postcard
								</b>
							</div>
						</>
					) : (
						<>
							<div className={styles.date}>
								{numberToPrettyWeek(postcard!.createdAt)}
							</div>
							<div className={styles.title}>
								You&apos;ve Received <br />
								<b>
									{postcard!.user.displayName}&apos;s Postcard
								</b>
							</div>
						</>
					)}
				</div>

				{loading ? (
					<div>
						<div
							className={styles.skeletonNextButton}
						>
							LET&apos;S GO →
						</div>
					</div>
				) : (
					<div>
						<button
							className={styles.summaryNextButton}
							onClick={showPostcard}
							disabled={!postcard}
						>
							LET&apos;S GO →
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
