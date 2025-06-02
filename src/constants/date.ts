export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export enum DURATION_STATUS {
	GOOD = 'GOOD',
	MEDIUM = 'MEDIUM',
	BAD = 'BAD',
}

export const DURATION_MESSAGES = [
	{
		days: 0,
		label: 'Get started!',
		status: DURATION_STATUS.GOOD,
	},
	{
		days: 5,
		label: 'Keep adding entries!',
		status: DURATION_STATUS.GOOD,
	},
	{
		days: 7,
		label: 'Finish your postcard!',
		status: DURATION_STATUS.GOOD,
	},
	{
		days: 10,
		label: 'Start sharing!',
		status: DURATION_STATUS.MEDIUM,
	},
	{
		days: 14,
		label: 'Share your postcard!',
		status: DURATION_STATUS.BAD,
	},
]