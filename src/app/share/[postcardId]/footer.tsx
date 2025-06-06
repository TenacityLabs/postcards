import Image from "next/image"
import styles from "./styles.module.scss"
import Link from "next/link"
import { useUser } from "@/app/context/userContext"
import { useScreenSize } from "@/app/hooks/useScreenSize"

export default function PostcardFooter() {
	const { user } = useUser()
	const { isMobile } = useScreenSize()

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		})
	}

	return (
		<div className={styles.footer}>
			{isMobile && (
				<button
					className={styles.scrollTopButton}
					onClick={scrollToTop}
				>
					<div className={styles.scrollTopIcon}>
						<Image
							src="/images/icons/scroll-to-top.svg"
							alt="↑"
							fill
						/>
					</div>
					<span>
						Back to top
					</span>
				</button>
			)}

			<Link
				href={user ? "/dashboard" : "/"}
				className={styles.createLink}
			>
				Create your Postcard
			</Link>

			<Link
				href={user ? "/dashboard" : "/"}
				className={styles.footerLogo}
			>
				<Image
					src="/logos/postcards-logo-wide-64.svg"
					alt="Postcards"
					fill
				/>
			</Link>
		</div>
	)
}


