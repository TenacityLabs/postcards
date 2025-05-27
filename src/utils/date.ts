// Convert date to format 'yyyy-mm-dd' to avoid timezone issues
export const dateToString = (date: Date) => {
	return date.toISOString().split('T')[0];
}

export const stringToDate = (date: string) => {
	// Force midnight at local timezone
	return new Date(date + 'T00:00:00.000');
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