import { validateDate } from '@/utils/date'
import mongoose, { Schema, Document } from 'mongoose'

export interface IEntry extends Document {
	_id: mongoose.Types.ObjectId
	title: string
	// Date in format 'yyyy-mm-dd' to avoid timezone issues
	date: string
	description: string
	imageUrl: string | null
	createdAt: number
}

const EntrySchema = new Schema<IEntry>({
	title: {
		type: String,
		required: false,
		default: '',
	},
	date: {
		type: String,
		required: false,
		nullable: true,
		default: null,
		validate: {
			validator: validateDate,
			message: 'Date must be either null or in format yyyy-mm-dd'
		}
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
	_id: mongoose.Types.ObjectId
	user: mongoose.Types.ObjectId
	entries: IEntry[]
	createdAt: number
	updatedAt: number
}

const PostcardSchema = new Schema<IPostcard>({
	// This is a two way relationship, so we need to make sure the user is immutable
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
		immutable: true,
	},
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
