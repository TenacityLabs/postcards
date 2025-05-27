import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { PostcardModel } from "@/models/Postcard";
import { UserModel } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const { postcardId, entryId } = await request.json()
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		if (!postcardId) {
			return NextResponse.json({ error: "No postcard ID provided" }, { status: 400 })
		}

		const user = await UserModel.exists({
			_id: userId,
			postcards: postcardId,
		})
		if (!user) {
			return NextResponse.json({ error: "User not found or does not have ownership of this postcard" }, { status: 404 })
		}

		const postcard = await PostcardModel.findByIdAndUpdate(
			postcardId,
			{
				$pull: {
					entries: { _id: entryId }
				}
			},
			{
				new: true,
				runValidators: true,
			}
		)

		if (!postcard) {
			return NextResponse.json({ error: "Postcard not found" }, { status: 404 })
		}

		return NextResponse.json({
			message: "Postcard created successfully",
			postcard: postcard.toObject({ versionKey: false }),
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error creating postcard: ${error}`)
		return NextResponse.json({ error: "Failed to create postcard" }, { status: 500 })
	}
}


