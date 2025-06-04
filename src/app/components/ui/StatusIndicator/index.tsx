import styles from './styles.module.scss'

export enum Status {
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error',
	INFO = 'info',
}

const statusClasses = {
	[Status.SUCCESS]: styles.success,
	[Status.WARNING]: styles.warning,
	[Status.ERROR]: styles.error,
	[Status.INFO]: styles.info,
}

interface StatusIndicatorProps {
	status: Status
}

export function StatusIndicator(props: StatusIndicatorProps) {
	const { status } = props

	const statusClass = statusClasses[status]

	return <div className={statusClass} />
}
