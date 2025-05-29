import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { IPostcard, PostcardModel } from "@/models/Postcard";
import { deleteFile, extractKeyFromUrl } from "@/utils/s3";
import { APIEndpoints, APIResponse, ErrorResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<APIEndpoints.DeleteEntry> | ErrorResponse>> {
	try {
		const { postcardId, entryId } = await request.json()
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		if (!postcardId) {
			return NextResponse.json(
				{ message: "No postcard ID provided" },
				{ status: 400 }
			)
		}

		const postcard: IPostcard | null = await PostcardModel.findOne({
			_id: postcardId,
			user: userId,
		})
		if (!postcard) {
			return NextResponse.json(
				{ message: "Postcard not found" },
				{ status: 404 }
			)
		}
		const entry = postcard.entries.find((e) => e._id.toString() === entryId)
		if (!entry) {
			return NextResponse.json(
				{ message: "Entry not found" },
				{ status: 404 }
			)
		}
		if (entry.imageUrl) {
			const key = extractKeyFromUrl(entry.imageUrl)
			await deleteFile(key)
		}

		postcard.entries = postcard.entries.filter((e) => e._id.toString() !== entryId)
		await postcard.save()

		return NextResponse.json({
			message: "Postcard created successfully",
			postcard: postcard.toObject({ versionKey: false }),
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error deleting postcard entry: ${error}`)
		return NextResponse.json(
			{ message: "Failed to delete postcard entry" },
			{ status: 500 }
		)
	}
}
