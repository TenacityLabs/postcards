import { IMAGE_MIME_TYPES, PREFERRED_IMAGE_QUALITY, PREFERRED_MAX_WIDTH } from "@/constants/file";

export async function compressImageToJPEG(
	file: File,
	maxWidth = PREFERRED_MAX_WIDTH,
	quality = PREFERRED_IMAGE_QUALITY
): Promise<File | null> {
	if (!IMAGE_MIME_TYPES.includes(file.type)) {
		throw new Error(`Invalid file type: ${file.type}`);
	}

	try {
		const imageBitmap = await createImageBitmap(file);

		const shouldScale = imageBitmap.width > maxWidth;
		const targetWidth = shouldScale ? maxWidth : imageBitmap.width;
		const targetHeight = shouldScale
			? imageBitmap.height * (maxWidth / imageBitmap.width)
			: imageBitmap.height;

		const canvas = document.createElement("canvas");
		canvas.width = targetWidth;
		canvas.height = targetHeight;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Failed to get canvas context");
		}

		ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

		return await new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						console.error("Failed to convert canvas to blob");
						resolve(null);
						return;
					}

					const jpegFile = new File([blob], "image.jpeg", { type: "image/jpeg" });
					resolve(jpegFile);
				},
				"image/jpeg",
				quality
			);
		});
	} catch (error) {
		throw new Error("Error compressing image:", { cause: error });
	}
}
