import { UserModel } from '@/models/User'
import { IUser } from '@/models/User'
import { ServerLogger } from '@/utils/logging'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'

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

		const newUser: IUser = await UserModel.create({
			email,
			password,
		})

		return NextResponse.json(
			{ message: 'Signup successful', user: newUser },
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
