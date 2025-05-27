export interface Postcard {
	_id: string
	entries: Entry[]
	createdAt: number
	updatedAt: number
}

export interface Entry {
	title: string
	description: string
	imageUrl: string | null
	createdAt: number
}
