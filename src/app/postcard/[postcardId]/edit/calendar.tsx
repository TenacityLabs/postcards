import CalendarIcon from '@/app/components/icons/CalendarIcon'
import styles from './calendar.module.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TriangleDown from '@/app/components/icons/TriangleDown'
import ChevronArrowLeftIcon from '@/app/components/icons/ChevronArrowLeftIcon'
import ChevronArrowRightIcon from '@/app/components/icons/ChevronArrowRightIcon'
import { MONTHS, WEEKDAYS } from '@/constants/date'
import { usePostcard } from '@/app/context/postcardContext'
import { PostcardDate } from '@/types/postcard'
import { showToast } from '@/app/components/ui/CustomToast'
import { Status } from '@/app/components/ui/StatusIndicator'

export const Calendar = () => {
	const { focusedEntryId, focusedEntry, updateEntry } = usePostcard()
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const calendarRef = useRef<HTMLDivElement>(null)

	const [selectingYear, setSelectingYear] = useState(false)

	const [selectedDate, setSelectedDate] = useState<PostcardDate | null>(null)
	// Month is 0-indexed
	const [focusedMonth, setFocusedMonth] = useState((new Date()).getMonth())
	const [focusedYear, setFocusedYear] = useState((new Date()).getFullYear())

	const actualDate = useMemo(() => {
		if (!focusedEntry || !focusedEntry.date) {
			return null
		}
		return `${MONTHS.TitleCase[focusedEntry.date.month - 1]} ${focusedEntry.date.day}, ${focusedEntry.date.year}`
	}, [focusedEntry])

	const selectableYears = useMemo(() => {
		const currentYear = new Date().getFullYear()
		const start = currentYear - 97
		return Array.from({ length: 99 }, (_, i) => start + i)
	}, [])

	// Refs to scroll to focused year by default
	const yearGridRef = useRef<HTMLDivElement>(null)
	const focusedYearButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!isCalendarOpen) {
			setSelectingYear(false)
		}
		if (!focusedEntry?.date) {
			const today = new Date()
			setSelectedDate(null)
			setFocusedMonth(today.getMonth())
			setFocusedYear(today.getFullYear())
			return
		}
		const postcardDate = focusedEntry.date
		setSelectedDate(postcardDate)
		setFocusedMonth(postcardDate.month)
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

	const handleClearDate = useCallback(() => {
		if (focusedEntryId) {
			updateEntry(focusedEntryId, {
				date: null,
			})
		}
		setIsCalendarOpen(false)
		showToast('Date cleared', Status.Success)
	}, [focusedEntryId, updateEntry])

	const handleConfirmSelectDate = useCallback(() => {
		if (focusedEntryId && selectedDate) {
			updateEntry(focusedEntryId, {
				date: selectedDate,
			})
		}
		setIsCalendarOpen(false)
		showToast('Updated date', Status.Success)
	}, [focusedEntryId, selectedDate, updateEntry])

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

	useEffect(() => {
		if (selectingYear && yearGridRef.current && focusedYearButtonRef.current) {
			const container = yearGridRef.current
			const focusedButton = focusedYearButtonRef.current

			const containerTop = container.getBoundingClientRect().top
			const buttonTop = focusedButton.getBoundingClientRect().top

			// Adjust scrollTop to bring the button into view
			container.scrollTop += buttonTop - containerTop - container.clientHeight / 2 + focusedButton.clientHeight / 2
		}
	}, [selectingYear])

	return (
		<div className={styles.container}>
			{/* Use onMouseDown to since event listeners are also mouseDown */}
			<button className={styles.calendarButton} onMouseDown={handleCalendarClick}>
				<span className={`${styles.date} ${actualDate ? '' : styles.noDate}`}>
					{actualDate}
				</span>
				<span className={styles.icon}>
					<CalendarIcon width={24} height={24} />
				</span>
			</button>

			{isCalendarOpen && (
				<div className={styles.calendar} ref={calendarRef}>
					<div className={styles.header}>
						<div className={styles.subtitle}>
							SELECT DATE
						</div>
						<div className={styles.titleDate}>
							{selectedDate ? (
								`Mon, ${MONTHS.TitleCaseShort[selectedDate.month - 1]} ${selectedDate.day}`
							) : (
								'Pick a date'
							)}
						</div>
					</div>
					<div className={styles.navigator}>
						<button className={styles.toggleNavigationButton} onClick={() => setSelectingYear(prev => !prev)}>
							<span>
								{MONTHS.TitleCase[focusedMonth - 1]} {focusedYear}
							</span>
							<span className={`${styles.triangleDown} ${selectingYear ? styles.rotateUp : ''}`}>
								<TriangleDown width={18} height={18} />
							</span>
						</button>
						{!selectingYear && (
							<div className={styles.navigationButtons}>
								<button className={styles.navigationButton} onClick={goToPreviousMonth}>
									<ChevronArrowLeftIcon width={24} height={24} />
								</button>
								<button className={styles.navigationButton} onClick={goToNextMonth}>
									<ChevronArrowRightIcon width={24} height={24} />
								</button>
							</div>
						)}
					</div>

					{selectingYear ? (
						<div className={styles.yearGridContainer}>
							<div className={styles.yearGrid} ref={yearGridRef}>
								{selectableYears.map(year => (
									<div
										className={styles.yearButtonContainer}
										key={year}
									>
										<button
											className={`${styles.year} ${year === focusedYear ? styles.focused : ''}`}
											onClick={() => setFocusedYear(year)}
											ref={year === focusedYear ? focusedYearButtonRef : null}
										>
											{year}
										</button>
									</div>
								))}
							</div>
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
						<button onClick={() => setIsCalendarOpen(false)}>
							Cancel
						</button>

						<div className={styles.confirmButtons}>
							<button onClick={handleClearDate}>
								Clear
							</button>
							<button onClick={handleConfirmSelectDate}>
								OK
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

