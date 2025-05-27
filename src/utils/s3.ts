import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ServerLogger } from "./serverLogger";

const S3_URL_PREFIX = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`

export const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
})

export const uploadFile = async (file: File, key: string): Promise<string> => {
	const buffer = Buffer.from(await file.arrayBuffer())

	const command = new PutObjectCommand({
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: file.type,
	})
	await s3Client.send(command)
	ServerLogger.info(`Uploaded file ${file.name} size ${file.size} to S3`)

	// Construct the public URL
	return `${S3_URL_PREFIX}${key}`
}

export const checkUrlInBucket = (url: string, directory: string = '') => {
	return url.startsWith(`${S3_URL_PREFIX}${directory}`)
}