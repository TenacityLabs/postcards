import { DURATION_MESSAGES, MONTHS } from "@/constants/date";

// Convert date to format 'yyyy-mm-dd' to avoid timezone issues
export const dateToString = (date: Date) => {
	return date.toISOString().split('T')[0];
}

export const stringToDate = (date: string) => {
	// Force midnight at local timezone
	return new Date(date + 'T00:00:00.000');
}

export const numberToPrettyDate = (date: number, includeYear = false) => {
	const dateObj = new Date(date)
	const month = dateObj.getUTCMonth()
	const day = dateObj.getUTCDate()
	const year = dateObj.getUTCFullYear()

	let prettyDate = `${MONTHS[month]} ${day}`
	if (includeYear) {
		prettyDate += `, ${year}`
	}
	return prettyDate
}

export const numberToPrettyWeek = (date: number, includeYear = false) => {
	// 6 days later
	const endDate = date + (6 * 24 * 60 * 60 * 1000)

	return `${numberToPrettyDate(date)} - ${numberToPrettyDate(endDate, includeYear)}`
}

export const getDaysElapsed = (createdAt: number) => {
	const now = Date.now()
	return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))
}

export const getDurationMessage = (createdAt: number) => {
	const daysElapsed = getDaysElapsed(createdAt)
	for (const msg of DURATION_MESSAGES) {
		if (daysElapsed < msg.days) {
			return msg
		}
	}
	return DURATION_MESSAGES[DURATION_MESSAGES.length - 1]
}

export const validateDate = (dateString: string | null) => {
	if (dateString === null) {
		return true;
	}
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(dateString)) {
		return false;
	}
	const date = new Date(dateString);
	return date instanceof Date && !isNaN(date.getTime());
}