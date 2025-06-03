import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { deleteFile, extractKeyFromUrl } from "@/utils/s3";
import { IEntry, IPostcard, PostcardModel } from "@/models/Postcard";
import { APIEndpoints, APIResponse, ErrorResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<APIEndpoints.DeleteEntryImage> | ErrorResponse>> {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		const { postcardId, entryId } = await request.json()

		if (!postcardId || !entryId) {
			return NextResponse.json(
				{ error: "No postcard ID, entry ID, or title provided" },
				{ status: 400 }
			)
		}

		const postcard: IPostcard | null = await PostcardModel.findOne({
			_id: postcardId,
			user: userId,
		})
		if (!postcard || postcard.user.toString() !== userId) {
			return NextResponse.json(
				{ error: "Postcard not found" },
				{ status: 404 }
			)
		}
		const entry: IEntry | undefined = postcard.entries.find((entry: IEntry) => entry._id.toString() === entryId)
		if (!entry) {
			return NextResponse.json(
				{ error: "Entry not found" },
				{ status: 404 }
			)
		}

		if (entry.imageUrl) {
			ServerLogger.info(`Deleting image URL for entry ${entryId}`)
			const key = extractKeyFromUrl(entry.imageUrl)
			await deleteFile(key)
		}

		entry.imageUrl = null
		entry.imageName = null
		postcard.updatedAt = Date.now()
		await postcard.save()

		return NextResponse.json({
			message: "Postcard entry image deleted successfully",
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error deleting postcard entry image: ${error}`)
		return NextResponse.json(
			{ error: "Failed to delete postcard entry image" },
			{ status: 500 }
		)
	}
}


