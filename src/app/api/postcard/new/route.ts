import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { PostcardModel } from "@/models/Postcard";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		// Start a session for the transaction
		const session = await mongoose.startSession()
		session.startTransaction()

		try {
			const user = await UserModel.findById(userId)
				.select('postcards')
				.session(session)
			if (!user) {
				await session.abortTransaction()
				return NextResponse.json(
					{ error: 'User not found' },
					{ status: 404 }
				)
			}

			const postcard = new PostcardModel({
				entries: [{
					title: '',
					description: '',
					imageUrl: null,
				}]
			})

			await postcard.save({ session })
			user.postcards.push(postcard._id)
			await user.save({ session })

			await session.commitTransaction()

			return NextResponse.json({
				postcard: postcard.toObject({ versionKey: false }),
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
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

