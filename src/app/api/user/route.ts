import { UserModel } from '@/models/User'
import { ServerLogger } from '@/utils/serverLogger'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/utils/auth'
import { PostcardModel } from '@/models/Postcard'
import { APIEndpoints, APIResponse, ErrorResponse } from '@/types/api'

export async function GET(request: Request): Promise<NextResponse<APIResponse<APIEndpoints.GetUser> | ErrorResponse>> {
	try {
		const authHeader = request.headers.get('Authorization')
		if (!authHeader?.startsWith('Bearer ')) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const token = authHeader.split(' ')[1]
		const payload = verifyToken(token)

		await connectToDatabase()
		const user = await UserModel.findById(payload.userId)
			.select('-password')
			.populate({
				path: 'postcards',
				select: '-entries',
				model: PostcardModel,
			})

		if (!user) {
			return NextResponse.json(
				{ message: 'User not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			user: user.toObject({ versionKey: false })
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`User fetch error: ${error}`)

		// Token expiration should only ever happen on get user
		// We will handle token refreshes later
		if (error instanceof Error && error.message.includes('expired')) {
			return NextResponse.json(
				{ message: 'Token has expired' },
				{ status: 401 }
			)
		}

		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
}
