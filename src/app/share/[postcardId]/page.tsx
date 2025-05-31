"use client"

import { usePostcard } from "@/app/context/postcardContext"
import PostcardHeader from "./header"
import styles from "./styles.module.scss"
import EntryCard from "@/app/components/ui/Postcard/EntryCard"
import Masonry from "react-masonry-css"
import PostcardFooter from "./footer"
import { useIsMobile } from "@/app/hooks/useIsMobile"
import { useEffect, useState } from "react"
import PostcardSummary from "./summary"
import Image from "next/image"

const breakpointColsObj = {
	default: 3,
	1500: 2,
	1000: 1,
}

export default function SharePostcard() {
	const { postcard, loading: postcardLoading } = usePostcard()
	const isMobile = useIsMobile()
	const [showSummary, setShowSummary] = useState(isMobile)
	const [showScrollTop, setShowScrollTop] = useState(false)

	useEffect(() => {
		setShowSummary(isMobile)
		setShowScrollTop(prev => prev || isMobile)
	}, [isMobile])

	useEffect(() => {
		const handleScroll = () => {
			setShowScrollTop(window.scrollY > 100)
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	if (postcardLoading) {
		return <div>Loading...</div>
	}
	if (!postcard) {
		return <div>Postcard not found</div>
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				{showSummary ? (
					<PostcardSummary showPostcard={() => setShowSummary(false)} />
				) : (
					<div className={styles.postcardContainer}>
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
						<PostcardFooter />
					</div>
				)}
			</div>

			{!isMobile && (
				<div className={`${styles.scrollTopFab} ${showScrollTop ? styles.fullOpacity : ""}`}>
					<button onClick={scrollToTop}>
						<Image
							src="/images/icons/scroll-to-top.svg"
							alt="↑"
							width={48}
							height={48}
						/>
					</button>
				</div>
			)}
		</div>
	)
}
