import styles from './styles.module.scss'

export enum Status {
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
	Info = 'info',
}

const statusClasses = {
	[Status.Success]: styles.success,
	[Status.Warning]: styles.warning,
	[Status.Error]: styles.error,
	[Status.Info]: styles.info,
}

interface StatusIndicatorProps {
	status: Status
}

export function StatusIndicator(props: StatusIndicatorProps) {
	const { status } = props

	const statusClass = statusClasses[status]

	return <div className={statusClass} />
}
