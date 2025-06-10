"use client"

import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, PREFERRED_IMAGE_QUALITY, PREFERRED_MAX_WIDTH } from "@/constants/file";
import { sendAPIRequest } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import { useCallback, useEffect } from "react";
import { APIEndpoints } from "@/types/api";
import { APIMethods } from "@/types/api";
import { compressImageToJPEG } from "@/utils/file";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import EditPostcardDesktop from "./desktop";
import { useScreenSize } from "@/app/hooks/useScreenSize";
import EditPostcardMobile from "./mobile";

export default function EditEntry() {
	const { user, loading: userLoading } = useUser()
	const { screenWidth } = useScreenSize()
	const { postcard, setPostcard, loading: postcardLoading, focusedEntryId, setFocusedEntryId, updateEntry } = usePostcard()
	const router = useRouter()

	useEffect(() => {
		if (userLoading || postcardLoading) {
			return
		}
		if (!user || !postcard) {
			ClientLogger.error('No user or postcard found')
			router.push('/dashboard')
			return
		}
	}, [userLoading, postcardLoading, user, postcard, router])

	const handleCreateEntry = useCallback(async () => {
		ClientLogger.info('Creating new entry')
		if (!postcard) {
			ClientLogger.error('No postcard found')
			return
		}
		try {
			const response = await sendAPIRequest(
				APIEndpoints.CreateEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id
				}
			)
			setPostcard(prevPostcard => {
				if (!prevPostcard) {
					return null
				}
				return {
					...prevPostcard,
					entries: [...prevPostcard.entries, response.entry]
				}
			})
			setFocusedEntryId(response.entry._id)
		} catch (error) {
			ClientLogger.error(error)
		}
	}, [postcard, setFocusedEntryId, setPostcard])

	const handleUploadEntryImage = useCallback(async (file: File) => {
		ClientLogger.info('Uploading entry image')
		if (!focusedEntryId || !postcard) {
			ClientLogger.error('No focused entry or postcard found')
			return
		}
		if (!IMAGE_MIME_TYPES.includes(file.type)) {
			ClientLogger.error(`Invalid file type: ${file.type}`)
			return
		}

		try {
			const compressedFile = await compressImageToJPEG(file, PREFERRED_MAX_WIDTH, PREFERRED_IMAGE_QUALITY)
			ClientLogger.info(`Compressed file to size: ${compressedFile?.size}`)
			if (!compressedFile) {
				ClientLogger.error('Failed to compress image')
				return
			}
			if (compressedFile.size > MAX_IMAGE_SIZE) {
				ClientLogger.error(`File size too large even after compression: ${file.size}`)
				return
			}

			const response = await sendAPIRequest(
				APIEndpoints.UploadEntryImage,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntryId,
					image: compressedFile,
					imageName: file.name,
				}
			)
			updateEntry(focusedEntryId, {
				imageUrl: response.imageUrl,
				imageName: response.imageName,
			})
		} catch (error) {
			console.log(error)
			ClientLogger.error(JSON.stringify(error))
		}
	}, [focusedEntryId, postcard, updateEntry])

	const handleDeleteEntryImage = useCallback(async () => {
		ClientLogger.info('Deleting entry image')
		if (!focusedEntryId || !postcard) {
			ClientLogger.error('No focused entry or postcard found')
			return
		}

		try {
			// Optimistically update the entry
			updateEntry(focusedEntryId, {
				imageUrl: null,
				imageName: null,
			})

			await sendAPIRequest(
				APIEndpoints.DeleteEntryImage,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntryId,
				}
			)
		} catch (error) {
			ClientLogger.error(JSON.stringify(error))
		}
	}, [focusedEntryId, postcard, updateEntry])

	const handleDeleteEntry = useCallback(async (entryId: string) => {
		ClientLogger.info('Deleting entry')
		if (!postcard) {
			ClientLogger.error('No postcard found')
			return
		}
		try {
			await sendAPIRequest(
				APIEndpoints.DeleteEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId,
				}
			)
			setPostcard(prevPostcard => {
				if (!prevPostcard) {
					return null
				}
				return {
					...prevPostcard,
					entries: prevPostcard.entries.filter(entry => entry._id !== entryId),
				}
			})
		} catch (error) {
			ClientLogger.error(error)
		}
	}, [postcard, setPostcard])

	useEffect(() => {
		// Handler to support pasting images from clipboard
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			for (const item of items) {
				if (item.type.startsWith("image/")) {
					const file = item.getAsFile();
					if (file) {
						ClientLogger.info("Image pasted from clipboard");
						handleUploadEntryImage(file);
						break;
					}
				}
			}
		};

		window.addEventListener("paste", handlePaste);
		return () => {
			window.removeEventListener("paste", handlePaste);
		};
	}, [handleUploadEntryImage]);

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault(); // Necessary to allow dropping
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer?.files?.length) return;
			const file = e.dataTransfer.files[0];
			ClientLogger.info("Image dropped onto page");
			handleUploadEntryImage(file);
		};

		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("drop", handleDrop);

		return () => {
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("drop", handleDrop);
		};
	}, [handleUploadEntryImage]);

	if (!postcard || !user) {
		return null
	}

	if (screenWidth > 1000) {
		return (
			<EditPostcardDesktop
				onCreateEntry={handleCreateEntry}
				onDeleteEntry={handleDeleteEntry}
				onUploadEntryImage={handleUploadEntryImage}
				onDeleteEntryImage={handleDeleteEntryImage}
			/>
		)
	} else {
		return (
			<EditPostcardMobile
				onCreateEntry={handleCreateEntry}
				onDeleteEntry={handleDeleteEntry}
				onUploadEntryImage={handleUploadEntryImage}
				onDeleteEntryImage={handleDeleteEntryImage}
			/>
		)
	}
}
