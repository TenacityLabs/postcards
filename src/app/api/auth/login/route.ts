import { IUser, UserModel } from '@/models/User'
import { ServerLogger } from '@/utils/logging'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface LoginRequest {
	email: string
	password: string
}

export async function POST(request: Request) {
	try {
		const body: LoginRequest = await request.json()
		const { email, password } = body

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			)
		}

		ServerLogger.sensitive(`Login request received for email: ${email}`)

		await connectToDatabase()
		const user: IUser | null = await UserModel.findOne({ email })
		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const token = jwt.sign(
			{ userId: user._id },
			JWT_SECRET,
			{ expiresIn: '7d' }
		)

		const userResponse = await UserModel.findById(user._id)
			.select('-password')

		return NextResponse.json(
			{
				message: 'Login successful',
				user: userResponse,
				token
			},
			{ status: 200 }
		)
	} catch (error) {
		ServerLogger.error(`Login error: ${error}`)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}