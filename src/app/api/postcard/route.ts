import { ServerLogger } from '@/utils/serverLogger'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import { verifyRequest } from '@/utils/auth'
import { PostcardModel } from '@/models/Postcard'
import { UserModel } from '@/models/User'

export async function GET(request: Request) {
	try {
		verifyRequest(request)
		const searchParams = new URL(request.url).searchParams
		const postcardId = searchParams.get('postcardId')

		await connectToDatabase()

		if (!postcardId) {
			return NextResponse.json(
				{ error: 'Postcard ID is required' },
				{ status: 400 }
			)
		}
		const postcard = await PostcardModel.findById(postcardId)
			.populate({
				path: 'user',
				select: 'firstName lastName',
				model: UserModel,
			})

		if (!postcard) {
			return NextResponse.json(
				{ error: 'Postcard not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			postcard: postcard.toObject({ versionKey: false })
		}, { status: 200 })
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

