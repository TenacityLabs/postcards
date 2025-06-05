"use client"

import { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import ArrowRightRoundedIcon from "@/app/components/icons/ArrowRightRoundedIcon";
import { showToast } from "@/app/components/ui/CustomToast";
import { Status } from "@/app/components/ui/StatusIndicator";
import { APIEndpoints, APIMethods } from "@/types/api";
import { sendAPIRequest } from "@/utils/api";
import { ClientLogger } from "@/utils/clientLogger";
import { validateEmail } from "@/utils/email";

interface LandingProps {
	navigateToLogin: () => void
	navigateToSignup: () => void
}

export default function Landing(props: LandingProps) {
	const { navigateToLogin, navigateToSignup } = props
	const [email, setEmail] = useState("");
	const [checkUserLoading, setCheckUserLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (checkUserLoading) {
			return
		}
		if (!email || !validateEmail(email)) {
			showToast("Please enter a valid email", Status.ERROR)
			return
		}

		try {
			setCheckUserLoading(true);
			const response = await sendAPIRequest(APIEndpoints.UserExists, APIMethods.POST, { email });
			if (response.exists) {
				navigateToLogin()
			} else {
				navigateToSignup()
			}
		} catch (error) {
			showToast("An error occurred while checking if the user exists", Status.ERROR)
			ClientLogger.error(`Error checking if user exists: ${error}`)
			setCheckUserLoading(false);
		}
	}

	return (
		<>
			<div className={styles.heading}>
				<div className={styles.logoContainer}>
					<Image
						src="/logos/logo-128.svg"
						alt="Postcards"
						width={96}
						height={96}
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
					alt="Postcard"
					width={1720}
					height={641}
					style={{
						height: '50vh',
						width: 'auto',
					}}
				/>
			</div>

			<form
				className={styles.cta}
				onSubmit={handleSubmit}
			>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button
					type="submit"
				>
					<ArrowRightRoundedIcon width={16} height={16} />
				</button>
			</form>
		</>
	);
}

