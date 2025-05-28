import { Entry, PostcardDate } from "@/types/postcard"
import styles from "./styles.module.scss"

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

	return (
		<div className={`${styles.card} ${cardColors[entry.cardColor]}`}>
			<EntryCardTitle title={entry.title} date={entry.date} />
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
				<span>{date.month} {date.day}, {date.year}</span>
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

