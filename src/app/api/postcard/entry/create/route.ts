import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { PostcardModel } from "@/models/Postcard";
import { APIEndpoints, APIResponse, ErrorResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<APIEndpoints.CreateEntry> | ErrorResponse>> {
	try {
		const { postcardId } = await request.json()
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		if (!postcardId) {
			return NextResponse.json(
				{ error: "No postcard ID provided" },
				{ status: 400 }
			)
		}

		const entry = {
			title: '',
			description: '',
			imageUrl: null,
		}

		const postcard = await PostcardModel.findOneAndUpdate(
			{
				_id: postcardId,
				user: userId,
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
			return NextResponse.json(
				{ error: "Postcard not found" },
				{ status: 404 }
			)
		}
		const entryResponse = postcard.entries[postcard.entries.length - 1]

		return NextResponse.json({
			entry: entryResponse.toObject({ versionKey: false }),
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error creating postcard entry: ${error}`)
		return NextResponse.json(
			{ error: "Failed to create postcard entry" },
			{ status: 500 }
		)
	}
}
