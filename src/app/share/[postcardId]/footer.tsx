import Image from "next/image"
import styles from "./styles.module.scss"
import Link from "next/link"
import { useUser } from "@/app/context/userContext"

export default function PostcardFooter() {
	const { user } = useUser()

	return (
		<div className={styles.footer}>
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


