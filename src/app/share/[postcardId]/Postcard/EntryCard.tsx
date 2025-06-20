import { Entry, PostcardDate } from "@/types/postcard"
import styles from "./styles.module.scss"
import { MONTHS } from "@/constants/date"
import Image from "next/image"
import { useMemo } from "react"
import { useScreenSize } from "@/app/hooks/useScreenSize"
import Linkify from "linkify-react"

const cardColors = [
	styles.cardColor0,
	styles.cardColor1,
	styles.cardColor2,
	styles.cardColor3,
	styles.cardColor4,
	styles.cardColor5,
	styles.cardColor6,
	styles.cardColor7,
	styles.cardColor8,
]

const linkifyOptions = {
	target: "_blank",
	rel: "noopener noreferrer",
	className: styles.link,
}

interface EntryCardProps {
	entry: Entry
}

export default function EntryCard(props: EntryCardProps) {
	const { entry } = props
	const { title, date, description, imageUrl, tapePattern, cardColor, hoverRotation } = entry
	const { isMobile } = useScreenSize()

	const hasTape = tapePattern !== -1
	const cardClass = useMemo(() => {
		const isCardCaption = imageUrl && !date && !description

		let cardClass = `${styles.card} ${cardColors[cardColor]}`
		if (isCardCaption) {
			cardClass += ` ${styles.captionCard}`
		}

		if (hasTape) {
			cardClass += ` ${styles.tapeCard}`
		}

		if (isMobile) {
			// No animations if it's on mobile
		}
		else if (description || hasTape) {
			// Grow on hover if it has a description or is taped
			cardClass += ` ${styles.growOnHover}`
		} else {
			// Rotate on hover if it has no description
			cardClass += ` ${styles.tiltOnHover}`
		}

		return cardClass
	}, [imageUrl, date, description, hasTape, cardColor, isMobile])

	return (
		<div
			className={cardClass}
			style={{ '--hover-rotation': `${hoverRotation}deg` } as React.CSSProperties}
		>
			{hasTape && (
				<div className={styles.tape}>
					<Image
						src={`/images/tape/tape-${tapePattern}.png`}
						alt="Tape"
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: 'auto', height: '36px' }}
					/>
				</div>
			)}
			<EntryCardTitle title={title} date={date} />
			{description && (
				<p className={styles.description}>
					<Linkify options={linkifyOptions}>{description}</Linkify>
				</p>
			)}
			{imageUrl && (
				<div className={styles.imageContainer}>
					<Image
						src={imageUrl}
						alt={title}
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: '100%', height: 'auto' }}
					/>
				</div>
			)}
		</div>
	)
}

interface EntryCardTitleProps {
	title: string
	date: PostcardDate | null
}

function EntryCardTitle(props: EntryCardTitleProps) {
	const { title, date } = props

	if (date) {
		return (
			<div className={styles.titleWithDate}>
				<h3>{title}</h3>
				<span>{MONTHS.AllCapsShort[date.month - 1]} {date.day}, {date.year}</span>
			</div>
		)
	} else {
		return (
			<div className={styles.title}>
				<h3>{title}</h3>
			</div>
		)
	}
}

