import { UserModel } from '@/models/User'
import { IUser } from '@/models/User'
import { ServerLogger } from '@/utils/serverLogger'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import { APIEndpoints, APIResponse, ErrorResponse } from '@/types/api'
import { UserExistsRequest } from '@/types/api/auth'

export async function POST(request: Request): Promise<NextResponse<APIResponse<APIEndpoints.UserExists> | ErrorResponse>> {
	try {
		const body: UserExistsRequest = await request.json()
		const { email } = body

		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			)
		}

		ServerLogger.sensitive(`User exists request received for email: ${email}`)

		await connectToDatabase()
		const user: IUser | null = await UserModel.findOne({ email })
		if (user) {
			return NextResponse.json(
				{ exists: true },
				{ status: 200 }
			)
		} else {
			return NextResponse.json(
				{ exists: false },
				{ status: 200 }
			)
		}
	} catch (error) {
		ServerLogger.error(`User exists error: ${error}`)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

