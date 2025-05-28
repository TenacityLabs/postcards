import { useCallback, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import { PostcardDate } from '@/types/postcard'
import { MONTHS, WEEKDAYS } from '@/constants/date'

interface DateInputProps {
	selectedDate: PostcardDate | null
	setSelectedDate: (date: PostcardDate) => void
	clearSelectedDate: () => void
}

export const DateInput = (props: DateInputProps) => {
	const { selectedDate, setSelectedDate, clearSelectedDate } = props

	const today = new Date()
	const [focusedYear, setFocusedYear] = useState(today.getFullYear())
	// Month is 0-indexed
	const [focusedMonth, setFocusedMonth] = useState(today.getMonth() + 1)

	const calendarDays = useMemo(() => {
		const daysInMonth = new Date(focusedYear, focusedMonth, 0).getDate()
		// Date is 0-indexed, Sunday is 0
		const firstDay = new Date(focusedYear, focusedMonth - 1, 1).getDay()

		const res = []
		for (let i = 0; i < firstDay; i++) {
			res.push(null)
		}
		for (let i = 1; i <= daysInMonth; i++) {
			res.push(i)
		}
		return res
	}, [focusedYear, focusedMonth])

	const goToPreviousMonth = () => {
		if (focusedMonth === 1) {
			setFocusedYear(focusedYear - 1)
			setFocusedMonth(12)
		} else {
			setFocusedMonth(focusedMonth - 1)
		}
	}

	const goToNextMonth = () => {
		if (focusedMonth === 12) {
			setFocusedYear(focusedYear + 1)
			setFocusedMonth(1)
		} else {
			setFocusedMonth(focusedMonth + 1)
		}
	}

	const isFocusedDate = useCallback((day: number | null) => {
		if (day === null || selectedDate === null) {
			return false
		}
		const postcardDate = new PostcardDate(focusedYear, focusedMonth, day)
		return postcardDate.equals(selectedDate)
	}, [focusedYear, focusedMonth, selectedDate])

	const handleSelectDate = (day: number | null) => {
		if (day === null) return
		setSelectedDate(new PostcardDate(focusedYear, focusedMonth, day))
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<button onClick={goToPreviousMonth}>Prev</button>
				<h4>{focusedYear}, {MONTHS[focusedMonth - 1]}</h4>
				<button onClick={goToNextMonth}>Next</button>
			</div>
			<div className={styles.calendar}>
				{WEEKDAYS.map((day) => (
					<div key={day} className={styles.dayLabel}>
						{day}
					</div>
				))}
				{calendarDays.map((day, index) => (
					<div
						key={`${focusedYear}-${focusedMonth}-${index}`}
						className={`${styles.day} ${isFocusedDate(day) ? styles.selected : ''}`}
						onClick={() => handleSelectDate(day)}
					>
						{day}
					</div>
				))}
				<div>
					<button onClick={clearSelectedDate}>Clear</button>
				</div>
			</div>
		</div >
	)
}

