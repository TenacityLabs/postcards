import mongoose, { Schema, Document } from 'mongoose'

export interface IEntry extends Document {
	title: string
	description: string
	imageUrl: string
	createdAt: number
}

const EntrySchema = new Schema<IEntry>({
	title: {
		type: String,
		required: false,
		default: '',
	},
	description: {
		type: String,
		required: false,
		default: '',
	},
	imageUrl: {
		type: String,
		required: false,
		nullable: true,
		default: null,
	},
	createdAt: {
		type: Number,
		required: true,
		default: () => Date.now(),
	},
})

export interface IPostcard extends Document {
	entries: IEntry[]
	createdAt: number
	updatedAt: number
}

const PostcardSchema = new Schema<IPostcard>({
	entries: {
		type: [EntrySchema],
		required: true,
	},
	createdAt: {
		type: Number,
		required: true,
		default: () => Date.now(),
	},
	updatedAt: {
		type: Number,
		required: true,
		default: () => Date.now(),
	},
})

export const PostcardModel = mongoose.models.Postcard || mongoose.model<IPostcard>('Postcard', PostcardSchema)
