"use client"

import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import EyeIcon from "@/app/components/icons/EyeIcon";
import EyeSlashIcon from "@/app/components/icons/EyeSlashIcon";
import Link from "next/link";

interface LoginMobileProps {
	email: string
	setEmail: (email: string) => void
	password: string
	setPassword: (password: string) => void
	isLoggingIn: boolean
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	isPasswordVisible: boolean
	setIsPasswordVisible: (isPasswordVisible: boolean) => void
}

export default function LoginMobile(props: LoginMobileProps) {
	const { email, setEmail, password, setPassword, isLoggingIn, handleSubmit, isPasswordVisible, setIsPasswordVisible } = props
	const emailRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (emailRef.current) {
			emailRef.current.focus()
		}
	}, [emailRef])

	return (
		<>
			<div className={styles.simpleAuth}>
				<Link
					href="/"
					className={styles.logoContainerMobile}
				>
					<Image
						src="/logos/logo-128.svg"
						alt="Postcards"
						width={36}
						height={36}
						className={styles.logo}
					/>
					<h2>Postcards</h2>
				</Link>

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

						<Link
							className={styles.link}
							href="/signup"
						>
							Don&apos;t have an account? Sign up instead.
						</Link>
					</div>
				</form>
			</div>
		</>
	)
}

