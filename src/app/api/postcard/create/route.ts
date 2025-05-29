import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { PostcardModel } from "@/models/Postcard";
import { IUserPopulated, UserModel } from "@/models/User";
import mongoose from "mongoose";
import { APIEndpoints, APIResponse, ErrorResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<APIEndpoints.CreatePostcard> | ErrorResponse>> {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		// Start a session for the transaction
		const session = await mongoose.startSession()
		session.startTransaction()

		try {
			const user: IUserPopulated | null = await UserModel.findById(userId)
				.select('postcards')
				.populate({
					path: 'postcards',
					select: '-entries',
					model: PostcardModel,
				})
				.session(session)

			if (!user) {
				await session.abortTransaction()
				return NextResponse.json(
					{ message: 'User not found' },
					{ status: 404 }
				)
			}

			const postcard = new PostcardModel({
				user: userId,
				entries: [{
					title: '',
					description: '',
					imageUrl: null,
				}]
			})

			await postcard.save({ session })
			user.postcards.push(postcard)
			await user.save({ session })

			await session.commitTransaction()

			return NextResponse.json({
				postcards: user.postcards.map(postcard => postcard.toObject({ versionKey: false })),
			}, { status: 200 })
		} catch (error) {
			// If anything fails, abort the transaction
			await session.abortTransaction()
			throw error
		} finally {
			session.endSession()
		}
	} catch (error) {
		ServerLogger.error(`Error creating postcard: ${error}`)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

