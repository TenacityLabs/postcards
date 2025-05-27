import { validateDate } from "@/utils/date"

export interface Postcard {
	_id: string
	entries: Entry[]
	createdAt: number
	updatedAt: number
}

export interface Entry {
	_id: string
	title: string
	description: string
	imageUrl: string | null
	createdAt: number
}

export class PostcardDate {
	private year: number
	private month: number
	private day: number

	constructor(date: string) {
		if (!validateDate(date)) {
			throw new Error('Invalid date')
		}
		const [year, month, day] = date.split('-').map(Number)
		this.year = year
		this.month = month
		this.day = day
	}

	update(year: number, month: number, day: number) {
		if (!validateDate(`${year}-${month}-${day}`)) {
			throw new Error('Invalid date')
		}
		this.year = year
		this.month = month
		this.day = day
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
		return `${this.year}-${this.month}-${this.day}`
	}
}
