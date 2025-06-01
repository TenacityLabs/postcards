import styles from "./styles.module.scss"

interface SkeletonCardProps {
	height: number
}

export default function SkeletonCard(props: SkeletonCardProps) {
	const { height } = props

	return (
		<div className={`${styles.card} ${styles.skeletonCard}`} style={{ height }}>
		</div>
	)
}
