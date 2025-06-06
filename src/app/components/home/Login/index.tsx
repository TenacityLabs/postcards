"use client"

import { useState } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import ArrowLeftRoundedIcon from "@/app/components/icons/ArrowLeftRoundedIcon";

interface LoginProps {
	email: string
	navigateToLanding: () => void
}

export default function Login(props: LoginProps) {
	const { email, navigateToLanding } = props
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log("submit")
	}

	return (
		<>
			<button
				className={styles.logoContainer}
				onClick={navigateToLanding}
			>
				<Image
					src="/logos/logo-128.svg"
					alt="Postcards"
					width={36}
					height={36}
				/>
				<h2>Postcards</h2>
			</button>

			<div className={styles.postcard}>
				<div className={styles.postcardContent}>
					<div className={styles.navigationContainer}>
						<div className={styles.navigation}>
							<button
								onClick={navigateToLanding}
							>
								<ArrowLeftRoundedIcon width={24} height={24} />
							</button>
							<h1>Login</h1>
						</div>

						<div>
							<Image
								src="/images/stamp.png"
								alt="Stamp"
								width={230}
								height={70}
							/>
						</div>
					</div>

					<div className={styles.divider} />

					<form
						className={styles.form}
						onSubmit={handleSubmit}
					>
						<div className={styles.formContent}>
							<div className={styles.formGroup}>
								<div className={styles.formLabel}>
									EMAIL ADDRESS
								</div>
								<div className={`${styles.formInput} ${styles.formInputDisabled}`}>
									{email}
								</div>
							</div>

							<div className={styles.formGroup}>
								<div className={styles.formLabel}>
									PASSWORD
								</div>
								<input
									className={styles.formInput}
									placeholder="Enter your password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						<button
							className={styles.submitButton}
							type="submit"
							disabled={!password}
						>
							Log in
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

