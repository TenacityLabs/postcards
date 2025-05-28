"use client"

import { usePostcard } from "@/app/context/postcardContext"
import PostcardHeader from "./header"
import styles from "./styles.module.scss"
import EntryCard from "@/app/components/ui/Postcard/EntryCard"

export default function SharePostcard() {
	const { postcard, loading: postcardLoading } = usePostcard()

	if (postcardLoading) {
		return <div>Loading...</div>
	}
	if (!postcard) {
		return <div>Postcard not found</div>
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<PostcardHeader />
				<div className={styles.entries}>
					<div className={styles.entryColumn}>
						{postcard.entries.map((entry) => (
							<EntryCard key={entry._id} entry={entry} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
