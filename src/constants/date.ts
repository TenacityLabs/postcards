import { Status } from "@/app/components/ui/StatusIndicator"

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export const DURATION_MESSAGES = [
	{
		days: 0,
		label: 'Get started!',
		status: Status.SUCCESS,
	},
	{
		days: 5,
		label: 'Keep adding entries!',
		status: Status.SUCCESS,
	},
	{
		days: 7,
		label: 'Finish your postcard!',
		status: Status.SUCCESS,
	},
	{
		days: 10,
		label: 'Start sharing!',
		status: Status.WARNING,
	},
	{
		days: 14,
		label: 'Share your postcard!',
		status: Status.ERROR,
	},
]