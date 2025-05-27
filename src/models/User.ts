import mongoose, { Schema, Document } from 'mongoose'
import { IPostcard } from './Postcard'

export interface IUser extends Document {
	email: string
	password: string
	postcards: mongoose.Types.ObjectId[]
	createdAt: number
}

export interface IUserPopulated extends Document {
	email: string
	password: string
	postcards: IPostcard[]
	createdAt: number
}

const UserSchema = new Schema<IUser>({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	postcards: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Postcard',
		default: [],
	},
	createdAt: {
		type: Number,
		required: true,
		default: () => Date.now(),
	}
})

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
