import CalendarIcon from '@/app/components/icons/CalendarIcon'
import styles from './calendar.module.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TriangleDown from '@/app/components/icons/TriangleDown'
import ChevronArrowLeftIcon from '@/app/components/icons/ChevronArrowLeftIcon'
import ChevronArrowRightIcon from '@/app/components/icons/ChevronArrowRightIcon'
import { MONTHS, WEEKDAYS } from '@/constants/date'
import { usePostcard } from '@/app/context/postcardContext'
import { PostcardDate } from '@/types/postcard'

export const Calendar = () => {
	const { focusedEntry } = usePostcard()
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const calendarRef = useRef<HTMLDivElement>(null)

	const [selectingYear, setSelectingYear] = useState(false)

	const [selectedDate, setSelectedDate] = useState(new PostcardDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
	// Month is 0-indexed
	const [focusedMonth, setFocusedMonth] = useState((new Date()).getMonth())
	const [focusedYear, setFocusedYear] = useState((new Date()).getFullYear())

	useEffect(() => {
		if (!focusedEntry?.date) {
			const today = new Date()
			setSelectedDate(new PostcardDate(today.getFullYear(), today.getMonth(), today.getDate()))
			setFocusedMonth(today.getMonth())
			setFocusedYear(today.getFullYear())
			return
		}
		const postcardDate = focusedEntry.date
		setSelectedDate(postcardDate)
		setFocusedMonth(postcardDate.month - 1)
		setFocusedYear(postcardDate.year)
	}, [focusedEntry?.date, isCalendarOpen])

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

	const isSelectedDate = useCallback((day: number | null) => {
		if (day === null || selectedDate === null) {
			return false
		}
		const postcardDate = new PostcardDate(focusedYear, focusedMonth, day)
		return postcardDate.equals(selectedDate)
	}, [focusedYear, focusedMonth, selectedDate])

	const handleSelectDate = useCallback((day: number | null) => {
		if (day === null) {
			return
		}
		setSelectedDate(new PostcardDate(focusedYear, focusedMonth, day))
	}, [focusedYear, focusedMonth])

	const handleCalendarClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setIsCalendarOpen(prev => !prev)
	}, [])

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
							Mon, {MONTHS.TitleCaseShort[selectedDate.month - 1]} {selectedDate.day}
						</div>
					</div>
					<div className={styles.navigator}>
						<button className={styles.toggleNavigationButton} onClick={() => setSelectingYear(prev => !prev)}>
							<span>
								{MONTHS.TitleCase[focusedMonth - 1]} {focusedYear}
							</span>
							<TriangleDown width={18} height={18} />
						</button>
						<div className={styles.navigationButtons}>
							<button className={styles.navigationButton} onClick={goToPreviousMonth}>
								<ChevronArrowLeftIcon width={24} height={24} />
							</button>
							<button className={styles.navigationButton} onClick={goToNextMonth}>
								<ChevronArrowRightIcon width={24} height={24} />
							</button>
						</div>
					</div>

					{selectingYear ? (
						<div>
							Year selector
						</div>
					) : (
						<div className={styles.calendarGridContainer}>
							<div className={styles.calendarGrid}>
								{WEEKDAYS.Single.map((day, index) => (
									<div key={`${day}-${index}`}>
										{day}
									</div>
								))}
								{calendarDays.map((day, index) => (
									<div key={`${focusedYear}-${focusedMonth}-${index}`}>
										<button
											className={`${day ? styles.day : styles.emptyDay} ${isSelectedDate(day) ? styles.focused : ''}`}
											onClick={() => handleSelectDate(day)}
										>
											{day}
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					<div className={styles.footer}>
						<button>
							Cancel
						</button>

						<div className={styles.confirmButtons}>
							<button>
								Clear
							</button>
							<button>
								OK
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

