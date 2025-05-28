import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { PostcardModel } from "@/models/Postcard";

export async function POST(request: NextRequest) {
	try {
		const { postcardId } = await request.json()
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		if (!postcardId) {
			return NextResponse.json({ error: "No postcard ID provided" }, { status: 400 })
		}

		const entry = {
			title: '',
			description: '',
			imageUrl: null,
		}

		const postcard = await PostcardModel.findOneAndUpdate(
			{
				_id: postcardId,
				userId: userId,
			},
			{
				$push: {
					entries: entry
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
		ServerLogger.error(`Error creating postcard entry: ${error}`)
		return NextResponse.json({ error: "Failed to create postcard entry" }, { status: 500 })
	}
}
