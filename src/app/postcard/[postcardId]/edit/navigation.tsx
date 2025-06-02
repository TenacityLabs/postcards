import Link from 'next/link'
import styles from './styles.module.scss'
import { getDaysElapsed, getDurationMessage, numberToPrettyDate } from '@/utils/date'
import ArrowLeftIcon from '@/app/components/icons/ArrowLeftIcon'
import { usePostcard } from '@/app/context/postcardContext'
import { useUser } from '@/app/context/userContext'
import EditIcon from '@/app/components/icons/EditIcon'
import { POSTCARD_SHARE_LINK_PREFIX } from '@/constants/postcard'
import { Entry } from '@/types/postcard'
import { DURATION_STATUS } from '@/constants/date'
import { useMemo } from 'react'

const DURATION_STATUS_CLASS = {
	[DURATION_STATUS.GOOD]: styles.goodStatus,
	[DURATION_STATUS.MEDIUM]: styles.mediumStatus,
	[DURATION_STATUS.BAD]: styles.badStatus,
}

interface NavigationProps {
	handleFocusEntry: (entry: Entry) => void
	focusedEntry: Entry | null
	handleCreateEntry: () => void
}

export const Navigation = (props: NavigationProps) => {
	const { handleFocusEntry, focusedEntry, handleCreateEntry } = props
	const { postcard } = usePostcard()
	const { user } = useUser()

	const [daysElapsed, durationMessage, durationStatusClass] = useMemo(() => {
		const daysElapsed = getDaysElapsed(postcard?.createdAt ?? 0)
		const durationMessage = getDurationMessage(postcard?.createdAt ?? 0)
		const durationStatusClass = DURATION_STATUS_CLASS[durationMessage.status]
		return [daysElapsed, durationMessage, durationStatusClass]
	}, [postcard?.createdAt])

	const handleCopyShareLink = () => {
		navigator.clipboard.writeText(`${POSTCARD_SHARE_LINK_PREFIX}${postcard?._id}`)
	}

	if (!postcard || !user) {
		return null
	}

	return (
		<div className={styles.navigation}>
			<div className={styles.header}>
				<Link
					href="/dashboard"
					className={styles.backButton}
				>
					<ArrowLeftIcon
						width={12}
						height={12}
					/>
					WEEK OF {numberToPrettyDate(postcard.createdAt)}
				</Link>
				<h1 className={styles.title}>
					{user.firstName} {user.lastName}&apos;s <b>Postcard</b>
				</h1>
			</div>
			<div className={styles.divider} />
			<div className={styles.entries}>
				<div className={styles.entriesHeader}>
					<h4>
						TABLE OF CONTENTS
					</h4>
					<button>
						<EditIcon
							width={24}
							height={24}
						/>
					</button>
				</div>
				{postcard.entries.map((entry) => (
					<button
						key={entry._id}
						onClick={() => handleFocusEntry(entry)}
						className={`${styles.entry} ${focusedEntry?._id === entry._id ? styles.focused : ''}`}
					>
						{entry.title.trim() || 'Untitled'}
					</button>
				))}
				<button
					className={styles.addNewEntry}
					onClick={handleCreateEntry}
				>
					+ Add new entry
				</button>
			</div>

			<div className={styles.divider} />

			<div className={styles.footer}>
				<div className={styles.createdStatus}>
					<div className={durationStatusClass} />
					<span>
						Created {daysElapsed} days ago. {durationMessage.label}
					</span>
				</div>
				<button
					className={styles.copyShareLink}
					onClick={handleCopyShareLink}
				>
					Share Postcard
				</button>
			</div>
		</div>
	)
}