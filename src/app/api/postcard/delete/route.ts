import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { PostcardModel } from "@/models/Postcard";
import { IUserPopulated, UserModel } from "@/models/User";
import mongoose from "mongoose";
import { deleteAllInPrefix } from "@/utils/s3";

export async function POST(request: NextRequest) {
	try {
		const { postcardId } = await request.json()
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		// Start a session for the transaction
		const session = await mongoose.startSession()
		session.startTransaction()

		try {
			const userExists = await UserModel.exists({
				_id: userId,
				postcards: postcardId,
			})
			if (!userExists) {
				await session.abortTransaction()
				return NextResponse.json(
					{ error: 'User not found or does not have ownership of this postcard' },
					{ status: 404 }
				)
			}

			await PostcardModel.deleteOne({ _id: postcardId }, { session })
			const user: IUserPopulated = await UserModel.findByIdAndUpdate(
				userId,
				{ $pull: { postcards: postcardId } },
				{ session, new: true }
			)
				.select('postcards')
				.populate({
					path: 'postcards',
					select: '-entries',
					model: PostcardModel,
				})

			await deleteAllInPrefix(`uploads/${postcardId}/`)
			await session.commitTransaction()

			return NextResponse.json({
				postcards: user.postcards.map((postcard) => postcard.toObject({ versionKey: false })),
			}, { status: 200 })
		} catch (error) {
			// If anything fails, abort the transaction
			await session.abortTransaction()
			throw error
		} finally {
			session.endSession()
		}
	} catch (error) {
		ServerLogger.error(`Error deleting postcard: ${error}`)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
