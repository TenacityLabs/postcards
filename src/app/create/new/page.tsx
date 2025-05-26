"use client"

import { FileInput } from "@/app/components/ui/FileInput";
import { TextArea, TextInput } from "@/app/components/ui/TextInput";
import Link from "next/link";
import { useState } from "react";

export default function CreateNewEntry() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState<File | null>(null)

	return (
		<div>
			<Link href="/dashboard">Dashboard</Link>
			<div>
				<TextInput
					placeholder="Title"
					value={title}
					setValue={setTitle}
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
					accept="image/*"
					file={image}
					onChange={setImage}
				/>
			</div>
		</div>
	)
}
