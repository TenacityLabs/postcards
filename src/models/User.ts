import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
	email: string
	password: string
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
	createdAt: {
		type: Number,
		required: true,
		default: () => Date.now(),
	}
})

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
