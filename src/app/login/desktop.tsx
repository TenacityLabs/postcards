"use client"

import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import ArrowLeftRoundedIcon from "@/app/components/icons/ArrowLeftRoundedIcon";
import EyeIcon from "@/app/components/icons/EyeIcon";
import EyeSlashIcon from "@/app/components/icons/EyeSlashIcon";
import Link from "next/link";

interface LoginDesktopProps {
	email: string
	setEmail: (email: string) => void
	password: string
	setPassword: (password: string) => void
	isLoggingIn: boolean
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	isPasswordVisible: boolean
	setIsPasswordVisible: (isPasswordVisible: boolean) => void
}

export default function LoginDesktop(props: LoginDesktopProps) {
	const { email, setEmail, password, setPassword, isLoggingIn, handleSubmit, isPasswordVisible, setIsPasswordVisible } = props
	const emailRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (emailRef.current) {
			emailRef.current.focus()
		}
	}, [emailRef])

	return (
		<>
			<Link
				href="/"
				className={styles.logoContainer}
			>
				<Image
					src="/logos/logo-128.svg"
					alt="Postcards"
					width={36}
					height={36}
				/>
				<h2>Postcards</h2>
			</Link>

			<div className={styles.postcard}>
				<div className={styles.postcardContent}>
					<div className={styles.navigationContainer}>
						<div className={styles.navigation}>
							<Link
								href="/"
							>
								<ArrowLeftRoundedIcon width={20} height={20} />
							</Link>
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
								<input
									ref={emailRef}
									disabled={isLoggingIn}
									className={styles.formInput}
									placeholder="Enter your email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className={styles.formGroup}>
								<div className={styles.formLabel}>
									PASSWORD
								</div>
								<div className={styles.passwordInputContainer}>
									<input
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
