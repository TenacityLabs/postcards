
"use client"

import { usePostcard } from "@/app/context/postcardContext"

export default function SharePostcard() {
	const { postcard } = usePostcard()

	return (
		<div>
			<h1>Lucas, {postcard?.createdAt}</h1>
		</div>
	)
}
