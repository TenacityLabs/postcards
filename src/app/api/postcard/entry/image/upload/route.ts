import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { deleteFile, extractKeyFromUrl, uploadFile } from "@/utils/s3";
import { IEntry, IPostcard, PostcardModel } from "@/models/Postcard";
import { APIEndpoints, APIResponse, ErrorResponse } from "@/types/api";
import { IMAGE_MIME_TYPES } from "@/constants/file";

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<APIEndpoints.EditEntry> | ErrorResponse>> {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		const formData = await request.formData()
		const postcardId = formData.get("postcardId") as string
		const entryId = formData.get("entryId") as string
		const image = formData.get("image") as File | string | null
		const imageName = formData.get("imageName") as string | null

		if (!postcardId || !entryId) {
			return NextResponse.json(
				{ message: "No postcard ID, entry ID, or title provided" },
				{ status: 400 }
			)
		}
		if (!(image instanceof File) || !imageName) {
			return NextResponse.json(
				{ message: "Invalid image or image name" },
				{ status: 400 }
			)
		}
		if (!IMAGE_MIME_TYPES.includes(image.type)) {
			return NextResponse.json(
				{ message: `Invalid file type, image is of mimetype ${image.type}` },
				{ status: 400 }
			)
		}

		const postcard: IPostcard | null = await PostcardModel.findOne({
			_id: postcardId,
			user: userId,
		})
		if (!postcard || postcard.user.toString() !== userId) {
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

		let imageUrl: string | null = null
		const fileExtension = `.${image.name.split('.').pop() || ''}`
		const key = `uploads/${postcardId}/${entryId}-${Date.now()}${fileExtension}`
		// Upload before deletion for safety
		imageUrl = await uploadFile(image, key)

		if (entry.imageUrl) {
			ServerLogger.info(`Deleting image URL for entry ${entryId}`)
			const key = extractKeyFromUrl(entry.imageUrl)
			await deleteFile(key)
		}

		entry.imageUrl = imageUrl
		entry.imageName = imageName
		postcard.updatedAt = Date.now()
		await postcard.save()

		return NextResponse.json({
			message: "Postcard entry image uploaded successfully",
			imageUrl: imageUrl,
			imageName: imageName,
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error uploading postcard entry image: ${error}`)
		return NextResponse.json(
			{ message: "Failed to upload postcard entry image" },
			{ status: 500 }
		)
	}
}

