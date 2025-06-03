import { CARD_COLORS, TAPE_CHANCE, TAPE_PATTERNS } from '@/constants/postcard'
import { validateDate } from '@/utils/date'
import mongoose, { Schema, Document } from 'mongoose'

const generateRandomTapePattern = () => {
	if (Math.random() < TAPE_CHANCE) {
		return Math.floor(Math.random() * TAPE_PATTERNS)
	} else {
		return -1
	}
}

const generateRandomCardColor = () => {
	return Math.floor(Math.random() * CARD_COLORS)
}

// Generate something between 0.5 and 2.0 in either direction
const generateRandomRotation = () => {
	const direction = Math.random() < 0.5 ? 1 : -1
	const rotation = 0.5 + (Math.random() * 1.5)
	const result = rotation * direction
	return Math.round(result * 100) / 100
}

export interface IEntry extends Document {
	_id: mongoose.Types.ObjectId
	title: string
	// Date in format 'yyyy-mm-dd' to avoid timezone issues
	date: string
	description: string
	imageUrl: string | null
	imageName: string | null
	tapePattern: number
	cardColor: number
	hoverRotation: number
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
	imageName: {
		type: String,
		required: false,
		nullable: true,
		default: null,
	},
	tapePattern: {
		type: Number,
		required: true,
		default: generateRandomTapePattern,
	},
	cardColor: {
		type: Number,
		required: true,
		default: generateRandomCardColor,
	},
	hoverRotation: {
		type: Number,
		required: true,
		default: generateRandomRotation,
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
