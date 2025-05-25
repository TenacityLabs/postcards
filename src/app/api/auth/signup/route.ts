import { UserModel } from '@/models/User'
import { IUser } from '@/models/User'
import { ServerLogger } from '@/utils/logging'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10')
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_DURATION = process.env.JWT_DURATION || '7d'

interface SignupRequest {
	email: string
	password: string
}

export async function POST(request: Request) {
	try {
		const body: SignupRequest = await request.json()
		const { email, password } = body

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			)
		}

		ServerLogger.sensitive(`Signup request received for email: ${email}`)

		await connectToDatabase()
		const user: IUser | null = await UserModel.findOne({ email })
		if (user) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 }
			)
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

		const newUser: IUser = await UserModel.create({
			email,
			password: hashedPassword,
		})

		const userResponse: IUser | null = await UserModel.findById(newUser._id)
			.select('-password')

		const token = jwt.sign(
			{ userId: newUser._id },
			JWT_SECRET,
			{ expiresIn: JWT_DURATION } as SignOptions
		)

		return NextResponse.json(
			{
				message: 'Signup successful',
				user: userResponse,
				token
			},
			{ status: 200 }
		)
	} catch (error) {
		ServerLogger.error(`Signup error: ${error}`)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
