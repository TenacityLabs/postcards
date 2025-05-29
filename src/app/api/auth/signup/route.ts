import { UserModel } from '@/models/User'
import { IUser } from '@/models/User'
import { ServerLogger } from '@/utils/serverLogger'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { APIEndpoints, APIResponse, ErrorResponse } from '@/types/api'
import { SignupRequest } from '@/types/api/auth'
import { PostcardModel } from '@/models/Postcard'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_DURATION = process.env.JWT_DURATION || '7d'

export async function POST(request: Request): Promise<NextResponse<APIResponse<APIEndpoints.Signup> | ErrorResponse>> {
	try {
		const body: SignupRequest = await request.json()
		const { email, password, firstName, lastName } = body

		if (!email || !password || !firstName || !lastName) {
			return NextResponse.json(
				{ message: 'Email, password, first name, and last name are required' },
				{ status: 400 }
			)
		}

		ServerLogger.sensitive(`Signup request received for email: ${email}`)

		await connectToDatabase()
		const user: IUser | null = await UserModel.findOne({ email })
		if (user) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 400 }
			)
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

		const newUser: IUser = await UserModel.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
		})

		const userResponse = await UserModel.findById(newUser._id)
			.select('-password')
			.populate({
				path: 'postcards',
				select: '-entries',
				model: PostcardModel,
			})

		if (!userResponse) {
			return NextResponse.json(
				{ message: 'Failed to create user' },
				{ status: 500 }
			)
		}

		const token = jwt.sign(
			{ userId: newUser._id },
			JWT_SECRET,
			{ expiresIn: JWT_DURATION } as SignOptions
		)

		return NextResponse.json(
			{
				user: userResponse.toObject({ versionKey: false }),
				token
			},
			{ status: 200 }
		)
	} catch (error) {
		ServerLogger.error(`Signup error: ${error}`)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
}
