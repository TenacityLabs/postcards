import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { IPostcard, PostcardModel } from "@/models/Postcard";
import { UserModel } from "@/models/User";
import { deleteFile, extractKeyFromUrl } from "@/utils/s3";

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

		const postcard: IPostcard | null = await PostcardModel.findOne({
			_id: postcardId,
		})
		if (!postcard) {
			return NextResponse.json({ error: "Postcard not found" }, { status: 404 })
		}
		const entry = postcard.entries.find((e) => e._id.toString() === entryId)
		if (!entry) {
			return NextResponse.json({ error: "Entry not found" }, { status: 404 })
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
		return NextResponse.json({ error: "Failed to delete postcard entry" }, { status: 500 })
	}
}
