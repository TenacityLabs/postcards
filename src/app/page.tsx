"use client"

import Link from "next/link";
import { LOCALSTORAGE_JWT_KEY } from "./constants/auth";
import { ClientLogger } from "@/utils/clientLogger";

export default function Home() {
	const handleClearToken = () => {
		localStorage.removeItem(LOCALSTORAGE_JWT_KEY)
		ClientLogger.info("Cleared local token")
	}

	return (
		<div>
			<div>
				Home
			</div>
			<div>
				<Link href="/login">Login</Link>
			</div>
			<div>
				<Link href="/signup">Signup</Link>
			</div>
			<button
				onClick={handleClearToken}
			>
				Clear local token
			</button>
		</div>
	);
}
