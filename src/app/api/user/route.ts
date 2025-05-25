import { UserModel } from '@/models/User'
import { ServerLogger } from '@/utils/serverLogger'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/utils/auth'

export async function GET(request: Request) {
	try {
		const authHeader = request.headers.get('Authorization')
		if (!authHeader?.startsWith('Bearer ')) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const token = authHeader.split(' ')[1]
		const payload = verifyToken(token)

		await connectToDatabase()
		const user = await UserModel.findById(payload.userId).select('-password')

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ user }, { status: 200 })
	} catch (error) {
		ServerLogger.error(`User fetch error: ${error}`)

		// Token expiration should only ever happen on get user
		// We will handle token refreshes later
		if (error instanceof Error && error.message.includes('expired')) {
			return NextResponse.json(
				{ error: 'Token has expired' },
				{ status: 401 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
