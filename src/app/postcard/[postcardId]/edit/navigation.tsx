import Link from 'next/link'
import styles from './navigation.module.scss'
import { getDaysElapsed, getDurationMessage, numberToPrettyDate } from '@/utils/date'
import ArrowLeftIcon from '@/app/components/icons/ArrowLeftIcon'
import { usePostcard } from '@/app/context/postcardContext'
import { useUser } from '@/app/context/userContext'
import { POSTCARD_SHARE_LINK_PREFIX } from '@/constants/postcard'
import { DURATION_STATUS } from '@/constants/date'
import { useMemo } from 'react'
import TrashIcon from '@/app/components/icons/TrashIcon'

const DURATION_STATUS_CLASS = {
	[DURATION_STATUS.GOOD]: styles.goodStatus,
	[DURATION_STATUS.MEDIUM]: styles.mediumStatus,
	[DURATION_STATUS.BAD]: styles.badStatus,
}

interface NavigationProps {
	onCreateEntry: () => void
	onDeleteEntry: (entryId: string) => void
}

export const Navigation = (props: NavigationProps) => {
	const { onCreateEntry, onDeleteEntry } = props
	const { postcard, focusedEntryId, setFocusedEntryId } = usePostcard()
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

	const handleDeleteEntry = (e: React.MouseEvent<HTMLButtonElement>, entryId: string) => {
		e.stopPropagation()
		onDeleteEntry(entryId)
	}

	if (!postcard || !user) {
		return null
	}

	return (
		<div className={styles.container}>
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
				</div>
				{postcard.entries.map((entry) => (
					<div
						key={entry._id}
						onClick={() => setFocusedEntryId(entry._id)}
						className={`${styles.entry} ${focusedEntryId === entry._id ? styles.focused : ''}`}
					>
						<span>
							{entry.title.trim() || 'Untitled'}
						</span>
						<button
							className={styles.deleteButton}
							onClick={(e) => handleDeleteEntry(e, entry._id)}
						>
							<TrashIcon width={24} height={24} />
						</button>
					</div>
				))}
				<button
					className={styles.addNewEntry}
					onClick={onCreateEntry}
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