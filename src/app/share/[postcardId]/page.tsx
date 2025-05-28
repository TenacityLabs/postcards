"use client"

import { usePostcard } from "@/app/context/postcardContext"
import PostcardHeader from "./header"
import styles from "./styles.module.scss"

export default function SharePostcard() {
	const { postcard, loading } = usePostcard()

	if (loading) {
		return <div>Loading...</div>
	}
	if (!postcard) {
		return <div>Postcard not found</div>
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<PostcardHeader />
			</div>
		</div>
	)
}
