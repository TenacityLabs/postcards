import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { checkUrlInBucket, uploadFile } from "@/utils/s3";
import { IEntry, IPostcard, PostcardModel } from "@/models/Postcard";

export async function POST(request: NextRequest) {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		const formData = await request.formData()
		const postcardId = formData.get("postcardId") as string
		const entryId = formData.get("entryId") as string
		const title = formData.get("title") as string
		const description = formData.get("description") as string
		const image = formData.get("file") as File | string | null

		if (!postcardId || !entryId || !title) {
			return NextResponse.json({ error: "No postcard ID, entry ID, or title provided" }, { status: 400 })
		}

		const postcard: IPostcard | null = await PostcardModel.findOne({
			_id: postcardId,
			userId: userId,
		})
		if (!postcard) {
			return NextResponse.json({ error: "Postcard not found" }, { status: 404 })
		}

		let imageUrl: string | null = null
		if (image && image instanceof File) {
			const imageFile = image as File
			const fileExtension = `.${imageFile.name.split('.').pop() || ''}`
			const key = `uploads/${postcardId}/${entryId}-${Date.now()}${fileExtension}`
			imageUrl = await uploadFile(imageFile, key)
		} else if (image && typeof image === 'string') {
			if (checkUrlInBucket(image)) {
				imageUrl = image
			} else {
				ServerLogger.error(`Invalid image URL does not start with S3 url prefix`)
			}
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
		ServerLogger.error(`Error editing postcard entry: ${error}`)
		return NextResponse.json({ error: "Failed to edit postcard entry" }, { status: 500 })
	}
}
