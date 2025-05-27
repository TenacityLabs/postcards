import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { uploadFile } from "@/utils/s3";
import { IEntry, IPostcard, PostcardModel } from "@/models/Postcard";
import { UserModel } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		const formData = await request.formData()
		const postcardId = formData.get("postcardId") as string
		const entryId = formData.get("entryId") as string
		const title = formData.get("title") as string
		const description = formData.get("description") as string
		const image = formData.get("file") as File | null | 'null'

		if (!postcardId || !entryId || !title) {
			return NextResponse.json({ error: "No postcard ID, entry ID, or title provided" }, { status: 400 })
		}

		const user = await UserModel.exists({
			_id: userId,
			postcards: postcardId,
		})
		if (!user) {
			return NextResponse.json({ error: "User not found or does not have ownership of this postcard" }, { status: 404 })
		}

		let imageUrl: string | null = null
		if (image && image instanceof File) {
			const imageFile = image as File
			imageUrl = await uploadFile(imageFile, `uploads/${Date.now()}-${imageFile.name}`)
		}

		const postcard: IPostcard | null = await PostcardModel.findById(postcardId)
		if (!postcard) {
			return NextResponse.json({ error: "Postcard not found" }, { status: 404 })
		}

		const entry = postcard.entries.find((entry: IEntry) => entry._id.toString() === entryId)
		if (!entry) {
			return NextResponse.json({ error: "Entry not found" }, { status: 404 })
		}

		entry.title = title
		entry.description = description
		entry.imageUrl = imageUrl
		postcard.updatedAt = Date.now()
		await postcard.save()

		return NextResponse.json({
			message: "Postcard created successfully",
			postcard: postcard.toJSON({ versionKey: false })
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error creating postcard: ${error}`)
		return NextResponse.json({ error: "Failed to create postcard" }, { status: 500 })
	}
}
