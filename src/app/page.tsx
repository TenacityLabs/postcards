"use client"

import Link from "next/link";
import { LOCALSTORAGE_JWT_KEY } from "./constants/auth";
import { ClientLogger } from "@/utils/clientLogger";
import { useUser } from "@/context/userContext";
import { useState } from "react";

export default function Home() {
	const { user, setUser } = useUser()

	const [file, setFile] = useState<File | null>(null)

	const handleLogout = () => {
		setUser(null)
		localStorage.removeItem(LOCALSTORAGE_JWT_KEY)
		ClientLogger.info("Cleared local token")
	}

	const handleUpload = () => {
		if (!user) {
			ClientLogger.error("User not logged in")
			return
		}
		if (!file) {
			ClientLogger.error("No file selected")
			return
		}
		ClientLogger.info(`Uploading file ${file.name} size ${file.size}`)
		const formData = new FormData()
		formData.append("file", file)
		fetch("/api/upload", {
			method: "POST",
			body: formData,
		})

	}

	return (
		<div>
			<div>
				Home
			</div>
			<div>
				{user ? (
					<div>
						<p>Welcome, {user.email}</p>
						<button onClick={handleLogout}>Logout</button>
					</div>
				) : (
					<div>
						Not logged in
					</div>
				)}
			</div>
			<div>
				<Link href="/login">Login</Link>
			</div>
			<div>
				<Link href="/signup">Signup</Link>
			</div>

			<div>
				<input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				<button onClick={handleUpload}>Upload</button>
			</div>
		</div>
	);
}
