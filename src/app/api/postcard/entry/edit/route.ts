import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/mongoose";
import { uploadFile } from "@/utils/s3";
import { PostcardModel } from "@/models/Postcard";

export async function POST(request: NextRequest) {
	try {
		const { userId } = verifyRequest(request)
		await connectToDatabase()

		const formData = await request.formData()
		const title = formData.get("title") as string
		const description = formData.get("description") as string
		const image = formData.get("file") as File | null | 'null'

		if (!title) {
			return NextResponse.json({ error: "No title provided" }, { status: 400 })
		}

		let imageUrl: string | null = null
		if (image && image instanceof File) {
			const imageFile = image as File
			imageUrl = await uploadFile(imageFile, `uploads/${Date.now()}-${imageFile.name}`)
		}

		// Create entry

		return NextResponse.json({
			message: "Postcard created successfully",
			// postcard
		}, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error creating postcard: ${error}`)
		return NextResponse.json({ error: "Failed to create postcard" }, { status: 500 })
	}
}
