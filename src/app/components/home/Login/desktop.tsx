"use client"

import { useEffect, useRef } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import ArrowLeftRoundedIcon from "@/app/components/icons/ArrowLeftRoundedIcon";
import EyeIcon from "../../icons/EyeIcon";
import EyeSlashIcon from "../../icons/EyeSlashIcon";

interface LoginDesktopProps {
	navigateToLanding: () => void
	email: string
	password: string
	setPassword: (password: string) => void
	isLoggingIn: boolean
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	isPasswordVisible: boolean
	setIsPasswordVisible: (isPasswordVisible: boolean) => void
}

export default function LoginDesktop(props: LoginDesktopProps) {
	const { navigateToLanding, email, password, setPassword, isLoggingIn, handleSubmit, isPasswordVisible, setIsPasswordVisible } = props
	const passwordRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (passwordRef.current) {
			passwordRef.current.focus()
		}
	}, [passwordRef])

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
								<ArrowLeftRoundedIcon width={20} height={20} />
							</button>
							<h1>Log in</h1>
						</div>

						<div>
							<Image
								src="/images/stamp.png"
								alt="Stamp"
								width={170}
								height={51}
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
								<div className={styles.passwordInputContainer}>
									<input
										ref={passwordRef}
										disabled={isLoggingIn}
										className={styles.passwordInput}
										placeholder="Enter your password"
										type={isPasswordVisible ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>

									<button
										className={styles.passwordVisibilityButton}
										type="button"
										onClick={() => setIsPasswordVisible(!isPasswordVisible)}
									>
										{isPasswordVisible ? (
											<EyeSlashIcon
												width={28}
												height={28}
											/>
										) : (
											<EyeIcon
												width={28}
												height={28}
											/>
										)}
									</button>
								</div>
							</div>
						</div>

						<button
							className={styles.submitButton}
							type="submit"
							disabled={isLoggingIn || !password}
						>
							Log in
						</button>
					</form>
				</div>
			</div>
		</>
	)
}