"use client"

import Link from "next/link"
import styles from "./styles.module.scss"
import Image from "next/image"
import { useUser } from "@/app/context/userContext"
import ArrowLeftRoundedIcon from "@/app/components/icons/ArrowLeftRoundedIcon"
import { usePostcard } from "@/app/context/postcardContext"
import EditPostcardNavigation from "./navigation"
import { useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Status, StatusIndicator } from "@/app/components/ui/StatusIndicator"
import { getDaysElapsed, getDurationMessage } from "@/utils/date"
import { POSTCARD_SHARE_LINK_PREFIX } from "@/constants/postcard"
import { showToast } from "@/app/components/ui/CustomToast"
import EditPostcardEntry from "./entry"
import CopyIcon from "@/app/components/icons/CopyIcon"
import PreviewIcon from "@/app/components/icons/PreviewIcon"

interface EditPostcardMobileProps {
	onCreateEntry: () => void
	onDeleteEntry: (entryId: string) => void
	onUploadEntryImage: (file: File) => void
	onDeleteEntryImage: (entryId: string) => void
}

export default function EditPostcardMobile(props: EditPostcardMobileProps) {
	const { onCreateEntry, onDeleteEntry, onUploadEntryImage, onDeleteEntryImage } = props
	const router = useRouter()
	const { user } = useUser()
	const { postcard, focusedEntryId, setFocusedEntryId } = usePostcard()

	useEffect(() => {
		setFocusedEntryId(null)
	}, [setFocusedEntryId])

	const handleNavigateBack = useCallback(() => {
		if (focusedEntryId) {
			setFocusedEntryId(null)
		} else {
			router.push('/dashboard')
		}
	}, [router, focusedEntryId, setFocusedEntryId])

	const [daysElapsed, durationMessage, durationStatus] = useMemo(() => {
		const daysElapsed = getDaysElapsed(postcard?.createdAt ?? 0)
		const durationMessage = getDurationMessage(postcard?.createdAt ?? 0)
		return [daysElapsed, durationMessage, durationMessage.status]
	}, [postcard?.createdAt])

	const handleCopyShareLink = () => {
		navigator.clipboard.writeText(`${POSTCARD_SHARE_LINK_PREFIX}${postcard?._id}`)
		showToast('Copied sharing link to clipboard', Status.Success)
	}

	if (!user) {
		return null
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<Link
					href='/dashboard'
					className={styles.logoContainer}
				>
					<Image
						src='/logos/logo-128.svg'
						alt='Postcards'
						width={32}
						height={32}
						className={styles.logo}
					/>
					<h2>
						Postcards
					</h2>
				</Link>

				<div className={styles.header}>
					<button
						className={styles.back}
						onClick={handleNavigateBack}
					>
						<ArrowLeftRoundedIcon
							width={20}
							height={20}
						/>
					</button>
					<h1>
						{user.displayName}&apos;s <b>Postcard</b>
					</h1>
				</div>

				{focusedEntryId ? (
					<EditPostcardEntry
						onUploadEntryImage={onUploadEntryImage}
						onDeleteEntryImage={onDeleteEntryImage}
						onDeleteEntry={onDeleteEntry}
					/>
				) : (
					<EditPostcardNavigation
						onCreateEntry={onCreateEntry}
					/>
				)}

				<div className={styles.footer}>
					<div className={styles.createdStatus}>
						<StatusIndicator status={durationStatus} />
						<span>
							Created {daysElapsed} days ago. {durationMessage.label}
						</span>
					</div>

					<Link
						href={`${POSTCARD_SHARE_LINK_PREFIX}${postcard?._id}`}
						target="_blank"
						className={styles.previewLink}
					>
						<PreviewIcon width={20} height={20} />
						<span>
							Preview
						</span>
					</Link>
					<button
						className={styles.copyShareLink}
						onClick={handleCopyShareLink}
					>
						<CopyIcon width={20} height={20} />
						Share Postcard
					</button>
				</div>
			</div>
		</div>
	)
}

