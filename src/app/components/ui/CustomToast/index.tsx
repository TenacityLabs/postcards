"use client"

import { XIcon } from '../../icons/XIcon'
import { Status, StatusIndicator } from '../StatusIndicator'
import styles from './styles.module.scss'
import { Toast, toast } from "react-hot-toast"

interface CustomToastProps {
	t: Toast
	message: string
	status: Status
}

const CustomToast = (props: CustomToastProps) => {
	const { t, message, status } = props

	const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		toast.dismiss(t.id)
	}

	return (
		<div className={`${styles.toast} ${t.visible ? styles.enter : styles.leave}`}>
			<div className={styles.content}>
				<StatusIndicator status={status} />
				<span>
					{message}
				</span>
			</div>

			<button className={styles.closeButton} onClick={handleClose}>
				<XIcon width={12} height={12} />
			</button>
		</div>
	)
}

export const showToast = (message: string, status: Status) => {
	toast.custom((t) => <CustomToast t={t} message={message} status={status} />)
}
