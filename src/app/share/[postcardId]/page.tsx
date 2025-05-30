"use client"

import { usePostcard } from "@/app/context/postcardContext"
import PostcardHeader from "./header"
import styles from "./styles.module.scss"
import EntryCard from "@/app/components/ui/Postcard/EntryCard"
import Masonry from "react-masonry-css"

const breakpointColsObj = {
	default: 3,
	1024: 2,
	640: 1,
}

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
				<Masonry
					breakpointCols={breakpointColsObj}
					className={styles.entries}
					columnClassName={styles.entryColumn}
				>
					{postcard.entries.map((entry) => (
						<EntryCard key={entry._id} entry={entry} />
					))}
				</Masonry>
			</div>
		</div>
	)
}
