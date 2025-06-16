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
	const month = dateObj.getMonth()
	const day = dateObj.getDate()
	const year = dateObj.getFullYear()

	let prettyDate = `${MONTHS.AllCaps[month]} ${day}`
	if (includeYear) {
		prettyDate += `, ${year}`
	}
	return prettyDate
}

export const numberToPrettyWeek = (date: number, includeYear = false) => {
	const inputDate = new Date(date);

	// Get day of the week (0 = Sunday, 6 = Saturday)
	const dayOfWeek = inputDate.getDay();

	// Find the Sunday of the week
	const sunday = new Date(inputDate);
	sunday.setDate(inputDate.getDate() - dayOfWeek);

	// Find the Saturday of the week
	const saturday = new Date(inputDate);
	saturday.setDate(inputDate.getDate() + (6 - dayOfWeek));

	return `${numberToPrettyDate(sunday.getTime())} - ${numberToPrettyDate(saturday.getTime(), includeYear)}`;
}

export const getDaysElapsed = (createdAt: number) => {
	const now = Date.now()
	return Math.max(0, Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)))
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