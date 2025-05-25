import { UserModel } from '@/models/User'
import { IUser } from '@/models/User'
import { ServerLogger } from '@/utils/logging'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10')

interface SignupRequest {
	email: string
	password: string
}

export async function POST(request: Request) {
	try {
		// Parse the request body
		const body: SignupRequest = await request.json()
		const { email, password } = body

		// Validate required fields
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

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

		const newUser: IUser = await UserModel.create({
			email,
			password: hashedPassword,
		})

		const userResponse: IUser | null = await UserModel.findById(newUser._id)
			.select('-password')

		return NextResponse.json(
			{ message: 'Signup successful', user: userResponse },
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
