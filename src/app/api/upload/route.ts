// Temporary test route for file uploads

import { ServerLogger } from "@/utils/serverLogger";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/utils/s3";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get("file") as File

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
		}

		// Convert File to Buffer
		const buffer = Buffer.from(await file.arrayBuffer())

		// Upload to S3
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: `uploads/${Date.now()}-${file.name}`,
			Body: buffer,
			ContentType: file.type,
		})

		await s3Client.send(command)

		ServerLogger.info(`Uploaded file ${file.name} size ${file.size} to S3`)
		return NextResponse.json({ message: "File uploaded successfully to S3" }, { status: 200 })
	} catch (error) {
		ServerLogger.error(`Error uploading file to S3: ${error}`)
		return NextResponse.json({ error: "Failed to upload file to S3" }, { status: 500 })
	}
}
