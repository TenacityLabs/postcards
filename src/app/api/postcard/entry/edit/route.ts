import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { IEntry, IPostcard, PostcardModel } from "@/models/Postcard";
import { validateDate } from "@/utils/date";
import { APIEndpoints, APIResponse, ErrorResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<APIEndpoints.EditEntry> | ErrorResponse>> {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()
		const { postcardId, entryId, title, description, date } = await request.json()

		if (!postcardId || !entryId) {
			return NextResponse.json(
				{ message: "No postcard ID, entry ID, or title provided" },
				{ status: 400 }
			)
		}
		if (date && !validateDate(date)) {
			return NextResponse.json(
				{ message: "Invalid date" },
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
		const entry: IEntry | undefined = postcard.entries.find((entry: IEntry) => entry._id.toString() === entryId)
		if (!entry) {
			return NextResponse.json(
				{ message: "Entry not found" },
				{ status: 404 }
			)
		}

		entry.title = title
		entry.description = description
		entry.date = date
		postcard.updatedAt = Date.now()
		await postcard.save()

		return NextResponse.json({
			message: "Postcard entry edited successfully",
			postcard: postcard.toJSON({ versionKey: false })
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error editing postcard entry: ${error}`)
		return NextResponse.json(
			{ message: "Failed to edit postcard entry" },
			{ status: 500 }
		)
	}
}
