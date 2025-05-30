import Image from "next/image"
import styles from "./styles.module.scss"

interface PostcardSummaryProps {
	showPostcard: () => void
}

export default function PostcardSummary(props: PostcardSummaryProps) {
	const { showPostcard } = props

	return (
		<div className={styles.summaryContainer}>
			<div className={styles.summary}>
				<div>
					<Image
						src="/logos/postcards-logo-wide-64.svg"
						alt="Postcards"
						width={115}
						height={24}
					/>
				</div>
				<div className={styles.summaryTitle}>
					<div className={styles.date}>
						May 30, 2025
					</div>
					<div className={styles.title}>
						You&apos;ve Received <br />
						<b>
							Emily&apos;s Postcard
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
