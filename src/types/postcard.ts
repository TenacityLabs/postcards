import { validateDate } from "@/utils/date"
import { User } from "./user"

export interface Postcard {
	_id: string
	user: User
	entries: Entry[]
	createdAt: number
	updatedAt: number
}

export interface Entry {
	_id: string
	title: string
	date: PostcardDate | null
	description: string
	imageUrl: string | null
	tapePattern: number
	cardColor: number
	hoverRotation: number
	createdAt: number
}

export class PostcardDate {
	public readonly year: number
	public readonly month: number
	public readonly day: number

	constructor(date: string)
	constructor(year: number, month: number, day: number)
	constructor(dateOrYear: string | number, month?: number, day?: number) {
		if (typeof dateOrYear === 'string') {
			if (!validateDate(dateOrYear)) {
				throw new Error('Invalid date')
			}
			const [year, month, day] = dateOrYear.split('-').map(Number)
			this.year = year
			this.month = month
			this.day = day
		} else {
			if (month === undefined || day === undefined) {
				throw new Error('Month and day are required when using numeric constructor')
			}
			this.year = dateOrYear
			this.month = month
			this.day = day
			validateDate(this.toString())
		}
	}

	equals(date: PostcardDate) {
		return this.year === date.year &&
			this.month === date.month &&
			this.day === date.day
	}

	before(date: PostcardDate) {
		return this.year < date.year ||
			(this.year === date.year && this.month < date.month) ||
			(this.year === date.year && this.month === date.month && this.day < date.day)
	}

	after(date: PostcardDate) {
		return this.year > date.year ||
			(this.year === date.year && this.month > date.month) ||
			(this.year === date.year && this.month === date.month && this.day > date.day)
	}

	toString() {
		const paddedYear = String(this.year).padStart(4, '0')
		const paddedMonth = String(this.month).padStart(2, '0')
		const paddedDay = String(this.day).padStart(2, '0')
		return `${paddedYear}-${paddedMonth}-${paddedDay}`
	}
}
