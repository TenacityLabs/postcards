import { Status } from "@/app/components/ui/StatusIndicator"

const WEEKDAYS_RAW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const WEEKDAYS = {
	TitleCase: WEEKDAYS_RAW,
	TitleCaseShort: WEEKDAYS_RAW.map(day => day.slice(0, 3)),
	AllCaps: WEEKDAYS_RAW.map(day => day.toUpperCase()),
	AllCapsShort: WEEKDAYS_RAW.map(day => day.toUpperCase().slice(0, 3)),

	Single: WEEKDAYS_RAW.map(day => day.slice(0, 1)),
}

const MONTHS_RAW = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const MONTHS = {
	TitleCase: MONTHS_RAW,
	TitleCaseShort: MONTHS_RAW.map(month => month.slice(0, 3)),
	AllCaps: MONTHS_RAW.map(month => month.toUpperCase()),
	AllCapsShort: MONTHS_RAW.map(month => month.toUpperCase().slice(0, 3)),

	Single: MONTHS_RAW.map(month => month.slice(0, 1)),
}

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