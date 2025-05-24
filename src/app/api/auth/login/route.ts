import { Logger } from '@/utils/logging'
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

		Logger.info(`Login request received for email: ${email}`)

		return NextResponse.json(
			{ message: 'Login successful' },
			{ status: 200 }
		)
	} catch (error) {
		Logger.error(`Login error: ${error}`)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}