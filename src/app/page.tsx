import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";

export default function Home() {
	return (
		<div className={styles.page}>
			<div className={styles.heading}>
				<div className={styles.logoContainer}>
					<Image
						src="/logos/logo-128.svg"
						alt="Postcards"
						width={96}
						height={96}
						className={styles.logo}
					/>
					<h1>Postcards</h1>
				</div>
				<h2 className={styles.subtitle}>
					A simple way to share life updates with loved ones
				</h2>
			</div>

			<div className={styles.heroContainer}>
				<Image
					src="/images/hero.png"
					priority
					alt="Postcard"
					width={1720}
					height={641}
					className={styles.heroImage}
				/>
			</div>

			<div className={styles.ctaContainer}>
				<Link
					href="/signup"
					className={styles.signup}
				>
					Sign up
				</Link>

				<Link
					href="/login"
					className={styles.login}
				>
					Log in
				</Link>
			</div>
		</div>
	);
}
