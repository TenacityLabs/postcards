"use client"

import { useEffect, useRef } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import EyeIcon from "../../icons/EyeIcon";
import EyeSlashIcon from "../../icons/EyeSlashIcon";

interface SignupMobileProps {
	navigateToLanding: () => void
	email: string
	setEmail: (email: string) => void
	firstName: string
	setFirstName: (firstName: string) => void
	lastName: string
	setLastName: (lastName: string) => void
	displayName: string
	setDisplayName: (displayName: string) => void
	password: string
	setPassword: (password: string) => void
	isPasswordVisible: boolean
	setIsPasswordVisible: (isPasswordVisible: boolean) => void
	isSigningUp: boolean
	handleSignup: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
	isFillingSenderInfo: boolean
	setIsFillingSenderInfo: (isFillingSenderInfo: boolean) => void
	handleContinue: (e: React.FormEvent<HTMLFormElement>) => void
	navigateToLogin: () => void
}

export default function SignupMobile(props: SignupMobileProps) {
	const { navigateToLanding, email, setEmail, firstName, setFirstName, lastName, setLastName, displayName, setDisplayName, password, setPassword, isPasswordVisible, setIsPasswordVisible, isSigningUp, handleSignup, isFillingSenderInfo, setIsFillingSenderInfo, handleContinue, navigateToLogin } = props
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
						className={styles.logo}
					/>
					<h2>Postcards</h2>
				</button>

				<h1>
					{isFillingSenderInfo ? "Sign up" : "Sender information"}
				</h1>

				{
					isFillingSenderInfo ? (
						<>
						</>
					) : (
						<>
						</>
					)
				}
				<form
					className={styles.form}
					onSubmit={handleContinue}
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
									disabled={isSigningUp}
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
								disabled={isSigningUp || !password}
							>
								Sign up
							</button>
						</div>

						<button
							className={styles.link}
							onClick={navigateToLogin}
						>
							Don&apos;t have an account? Sign up instead.
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
