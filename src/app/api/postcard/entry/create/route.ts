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
				{ message: "No postcard ID provided" },
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
				{ message: "Postcard not found" },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			message: "Postcard created successfully",
			postcard: postcard.toObject({ versionKey: false }),
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error creating postcard entry: ${error}`)
		return NextResponse.json(
			{ message: "Failed to create postcard entry" },
			{ status: 500 }
		)
	}
}
