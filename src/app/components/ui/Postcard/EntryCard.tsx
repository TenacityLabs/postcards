import { Entry, PostcardDate } from "@/types/postcard"
import styles from "./styles.module.scss"
import { MONTHS } from "@/constants/date"
import Image from "next/image"

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

interface EntryCardProps {
	entry: Entry
}

export default function EntryCard(props: EntryCardProps) {
	const { entry } = props
	const { title, date, description, imageUrl, cardColor } = entry

	const isCardCaption = imageUrl && !date && !description

	return (
		<div className={`${styles.card} ${cardColors[cardColor]} ${isCardCaption ? styles.captionCard : ""}`}>
			<EntryCardTitle title={title} date={date} />
			{description && (
				<p className={styles.description}>
					{description}
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
				<span>{MONTHS[date.month - 1]} {date.day}, {date.year}</span>
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

