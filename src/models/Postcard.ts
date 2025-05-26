import mongoose, { Schema, Document } from 'mongoose'

export interface IPostcard extends Document {
	title: string
	description: string
	imageUrl: string
	createdAt: number
	updatedAt: number
}

const PostcardSchema = new Schema<IPostcard>({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
		nullable: true,
		default: null
	},
	imageUrl: {
		type: String,
		required: false,
		nullable: true,
		default: null
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
	}
})

export const PostcardModel = mongoose.models.Postcard || mongoose.model<IPostcard>('Postcard', PostcardSchema)
