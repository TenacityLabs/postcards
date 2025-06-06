"use client"

import { useEffect, useRef } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import EyeIcon from "../../icons/EyeIcon";
import EyeSlashIcon from "../../icons/EyeSlashIcon";

interface LoginMobileProps {
	navigateToLanding: () => void
	email: string
	password: string
	setPassword: (password: string) => void
	isLoggingIn: boolean
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	isPasswordVisible: boolean
	setIsPasswordVisible: (isPasswordVisible: boolean) => void
	navigateToSignup: () => void
}

export default function LoginMobile(props: LoginMobileProps) {
	const { navigateToLanding, navigateToSignup, email, password, setPassword, isLoggingIn, handleSubmit, isPasswordVisible, setIsPasswordVisible } = props
	const passwordRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (passwordRef.current) {
			passwordRef.current.focus()
		}
	}, [passwordRef])

	return (
		<>
			<div className={styles.simpleAuth}>
				<button
					className={styles.logoContainerMobile}
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

				<h1>
					Log in
				</h1>

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

					<div className={styles.authFooter}>
						<div className={styles.submitContainer}>
							<button
								className={styles.submitButton}
								type="submit"
								disabled={isLoggingIn || !password}
							>
								Log in
							</button>
						</div>

						<button
							className={styles.link}
							onClick={navigateToSignup}
						>
							Don&apos;t have an account? Sign up instead.
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
