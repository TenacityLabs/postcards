import { IUser, UserModel } from '@/models/User'
import { ServerLogger } from '@/utils/logging'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'

interface LoginRequest {
	email: string
	password: string
}

export async function POST(request: Request) {
	try {
		// Parse the request body
		const body: LoginRequest = await request.json()
		const { email, password } = body

		// Validate required fields
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
				{ error: 'User not found' },
				{ status: 404 }
			)
		}

		if (user.password !== password) {

		}
		return NextResponse.json(
			{ message: 'Login successful' },
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