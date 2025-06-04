import CalendarIcon from '@/app/components/icons/CalendarIcon'
import styles from './calendar.module.scss'
import { useEffect, useRef, useState } from 'react'
import TriangleDown from '@/app/components/icons/TriangleDown'

export const Calendar = () => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const calendarRef = useRef<HTMLDivElement>(null)

	const [selectingYear, setSelectingYear] = useState(false)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				calendarRef.current &&
				!calendarRef.current.contains(event.target as Node)
			) {
				setIsCalendarOpen(false)
			}
		}

		if (isCalendarOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isCalendarOpen])

	const handleCalendarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setIsCalendarOpen(prev => !prev)
	}

	return (
		<div className={styles.container}>
			{/* Use onMouseDown to since event listeners are also mouseDown */}
			<button className={styles.calendarButton} onMouseDown={handleCalendarClick}>
				<CalendarIcon width={36} height={36} />
			</button>

			{isCalendarOpen && (
				<div className={styles.calendar} ref={calendarRef}>
					<div className={styles.header}>
						<div className={styles.subtitle}>
							SELECT DATE
						</div>
						<div className={styles.titleDate}>
							Mon, Aug 17
						</div>
					</div>
					<div className={styles.navigator}>
						<button className={styles.toggleNavigationButton} onClick={() => setSelectingYear(prev => !prev)}>
							<span>
								August 2025
							</span>
							<TriangleDown width={18} height={18} />
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

