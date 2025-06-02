"use client"

import { DateInput } from "@/app/components/ui/DateInput";
import styles from "./styles.module.scss"
import { FileInput } from "@/app/components/ui/FileInput";
import { TextArea, TextInput } from "@/app/components/ui/TextInput";
import { usePostcard } from "@/app/context/postcardContext";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, PREFERRED_IMAGE_QUALITY, PREFERRED_MAX_WIDTH } from "@/constants/file";
import { Entry, PostcardDate } from "@/types/postcard";
import { sendAPIRequest } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { POSTCARD_SHARE_LINK_PREFIX } from "@/constants/postcard";
import { APIEndpoints } from "@/types/api";
import { APIMethods } from "@/types/api";
import { compressImageToJPEG } from "@/utils/file";
import { getDaysElapsed, getDurationMessage, numberToPrettyDate } from "@/utils/date";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import EditIcon from "@/app/components/icons/EditIcon";
import ArrowLeftIcon from "@/app/components/icons/ArrowLeftIcon";
import { DURATION_STATUS } from "@/constants/date";

const DURATION_STATUS_CLASS = {
	[DURATION_STATUS.GOOD]: styles.goodStatus,
	[DURATION_STATUS.MEDIUM]: styles.mediumStatus,
	[DURATION_STATUS.BAD]: styles.badStatus,
}

export default function EditEntry() {
	const { user, loading: userLoading } = useUser()
	const { postcard, loading: postcardLoading, setPostcard, focusedEntry, setFocusedEntry } = usePostcard()
	const router = useRouter()
	const [title, setTitle] = useState('')
	const [date, setDate] = useState<PostcardDate | null>(null)
	const [description, setDescription] = useState('')
	// Allow file or image url for reuploads
	const [image, setImage] = useState<File | string | null>(null)

	const [daysElapsed, durationMessage, durationStatusClass] = useMemo(() => {
		const daysElapsed = getDaysElapsed(postcard?.createdAt ?? 0)
		const durationMessage = getDurationMessage(postcard?.createdAt ?? 0)
		const durationStatusClass = DURATION_STATUS_CLASS[durationMessage.status]
		return [daysElapsed, durationMessage, durationStatusClass]
	}, [postcard?.createdAt])

	useEffect(() => {
		if (focusedEntry) {
			setTitle(focusedEntry.title)
			setDate(focusedEntry.date)
			setDescription(focusedEntry.description)
			setImage(focusedEntry.imageUrl)
		}
	}, [focusedEntry])

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
						handleImageChange(file);
						break;
					}
				}
			}
		};

		window.addEventListener("paste", handlePaste);
		return () => {
			window.removeEventListener("paste", handlePaste);
		};
	}, []);

	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault(); // Necessary to allow dropping
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer?.files?.length) return;
			const file = e.dataTransfer.files[0];
			ClientLogger.info("Image dropped onto page");
			handleImageChange(file);
		};

		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("drop", handleDrop);

		return () => {
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("drop", handleDrop);
		};
	}, []);

	const handleFocusEntry = (entry: Entry) => {
		setFocusedEntry(entry)
	}

	const handleCreateEntry = async () => {
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
			setPostcard(response.postcard)
			if (response.postcard.entries.length > 0) {
				setFocusedEntry(response.postcard.entries[response.postcard.entries.length - 1])
			} else {
				setFocusedEntry(null)
			}
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	const handleCopyShareLink = () => {
		navigator.clipboard.writeText(`${POSTCARD_SHARE_LINK_PREFIX}${postcard?._id}`)
	}

	const handleImageChange = async (file: File | null) => {
		ClientLogger.info(`Image uploaded with size: ${file ? file.size : 'null'}`)
		if (!file) {
			setImage(null)
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
			setImage(compressedFile)
		} catch (error) {
			ClientLogger.error(JSON.stringify(error))
		}
	}

	const handleSubmitEntry = async () => {
		ClientLogger.info('Submitting new entry')
		if (!postcard || !focusedEntry) {
			ClientLogger.error('No postcard or focused entry found')
			return
		}

		try {
			const response = await sendAPIRequest(
				APIEndpoints.EditEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntry._id,
					title,
					description,
					file: image,
					date: date ? date.toString() : null
				}
			)
			ClientLogger.info(`Postcard created: ${JSON.stringify(response)}`)
			setPostcard(response.postcard)
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	const handleDeleteEntry = async () => {
		ClientLogger.info('Deleting entry')
		if (!postcard || !focusedEntry) {
			ClientLogger.error('No postcard or focused entry found')
			return
		}
		try {
			const response = await sendAPIRequest(
				APIEndpoints.DeleteEntry,
				APIMethods.POST,
				{
					postcardId: postcard._id,
					entryId: focusedEntry._id
				}
			)
			setPostcard(response.postcard)
		} catch (error) {
			ClientLogger.error(error)
		}
	}

	if (!postcard || !user) {
		return null
	}

	return (
		<div className={styles.page}>
			<div className={styles.navigation}>
				<div className={styles.header}>
					<Link
						href="/dashboard"
						className={styles.backButton}
					>
						<ArrowLeftIcon
							width={12}
							height={12}
						/>
						WEEK OF {numberToPrettyDate(postcard.createdAt)}
					</Link>
					<h1 className={styles.title}>
						{user.firstName} {user.lastName}&apos;s <b>Postcard</b>
					</h1>
				</div>
				<div className={styles.divider} />
				<div className={styles.entries}>
					<div className={styles.entriesHeader}>
						<h4>
							TABLE OF CONTENTS
						</h4>
						<button>
							<EditIcon
								width={24}
								height={24}
							/>
						</button>
					</div>
					{postcard.entries.map((entry) => (
						<button
							key={entry._id}
							onClick={() => handleFocusEntry(entry)}
							className={`${styles.entry} ${focusedEntry?._id === entry._id ? styles.focused : ''}`}
						>
							{entry.title.trim() || 'Untitled'}
						</button>
					))}
					<button
						className={styles.addNewEntry}
						onClick={handleCreateEntry}
					>
						+ Add new entry
					</button>
				</div>

				<div className={styles.divider} />

				<div className={styles.footer}>
					<div className={styles.createdStatus}>
						<div className={durationStatusClass} />
						<span>
							Created {daysElapsed} days ago. {durationMessage.label}
						</span>
					</div>
					<button
						className={styles.copyShareLink}
						onClick={handleCopyShareLink}
					>
						Share Postcard
					</button>
				</div>
			</div>

			<div>
				{focusedEntry ? (
					<div>
						<div>
							<TextInput
								placeholder="Title"
								value={title}
								setValue={setTitle}
							/>
						</div>
						<div>
							<DateInput
								selectedDate={date}
								setSelectedDate={setDate}
								clearSelectedDate={() => setDate(null)}
							/>
						</div>
						<div>
							<TextArea
								placeholder="Description"
								value={description}
								setValue={setDescription}
								rows={10}
								maxLength={500}
							/>
						</div>
						<div>
							<FileInput
								label="Upload File"
								accept={IMAGE_MIME_TYPES.join(',')}
								labelText={image ? 'File uploaded' : 'No file selected'}
								onChange={handleImageChange}
							/>
						</div>
						<div>
							<button onClick={handleSubmitEntry}>Submit</button>
						</div>
						<div>
							<button onClick={handleDeleteEntry}>Delete</button>
						</div>
					</div>
				) : (
					<div>
						{postcard?.entries.length ? (
							<p>
								No entry found. Create one to get started.
							</p>
						) : (
							<p>
								Select an entry to start editing.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
