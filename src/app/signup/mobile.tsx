"use client"

import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import EyeIcon from "@/app/components/icons/EyeIcon";
import EyeSlashIcon from "@/app/components/icons/EyeSlashIcon";
import CircleXIcon from "@/app/components/icons/CircleXIcon";
import CircleCheckIcon from "@/app/components/icons/CircleCheckIcon";
import { containsLowercaseLetter, containsNumber, containsUppercaseLetter, MINIMUM_PASSWORD_LENGTH, validatePassword } from "@/utils/auth";
import Link from "next/link";

const CheckIcon = (isChecked: boolean) => {
	if (isChecked) {
		return (
			<div className={styles.iconChecked}>
				<CircleCheckIcon width={24} height={24} />
			</div>
		)
	} else {
		return (
			<div className={styles.iconUnchecked}>
				<CircleXIcon width={24} height={24} />
			</div>
		)
	}
}

interface SignupMobileProps {
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
	handleContinue: (e: React.FormEvent<HTMLFormElement>) => void
	backToAuth: () => void
}

export default function SignupMobile(props: SignupMobileProps) {
	const { email, setEmail, firstName, setFirstName, lastName, setLastName, displayName, setDisplayName, password, setPassword, isPasswordVisible, setIsPasswordVisible, isSigningUp, handleSignup, isFillingSenderInfo, handleContinue, backToAuth } = props
	const emailRef = useRef<HTMLInputElement>(null)
	const firstNameRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (emailRef.current && !isFillingSenderInfo) {
			emailRef.current.focus()
		}
	}, [emailRef, isFillingSenderInfo])

	useEffect(() => {
		if (firstNameRef.current && isFillingSenderInfo) {
			firstNameRef.current.focus()
		}
	}, [firstNameRef, isFillingSenderInfo])

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
					{isFillingSenderInfo ? "Sender information" : "Sign up"}
				</h1>

				{
					isFillingSenderInfo ? (
						<form
							className={styles.form}
							onSubmit={handleSignup}
						>
							<div className={styles.formContent}>
								<div className={styles.formGroup}>
									<div className={styles.formLabel}>
										FIRST NAME
									</div>
									<input
										ref={firstNameRef}
										disabled={isSigningUp}
										className={styles.passwordInput}
										placeholder="Enter your first name"
										type="text"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</div>

								<div className={styles.formGroup}>
									<div className={styles.formLabel}>
										LAST NAME
									</div>
									<input
										disabled={isSigningUp}
										className={styles.passwordInput}
										placeholder="Enter your last name"
										type="text"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
									/>
								</div>

								<div className={styles.formGroup}>
									<div className={styles.formLabel}>
										DISPLAY NAME
									</div>
									<input
										disabled={isSigningUp}
										className={styles.passwordInput}
										placeholder="Not too edgy pls"
										type="text"
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
									/>
								</div>
							</div>

							<div className={styles.authFooter}>
								<div className={styles.submitContainer}>
									<button
										className={styles.backButton}
										type="button"
										onClick={(e) => {
											e.preventDefault()
											backToAuth()
										}}>
										Back
									</button>
									<button
										className={styles.submitButton}
										type="submit"
										disabled={isSigningUp || !firstName || !lastName || !displayName}
									>
										Sign up
									</button>
								</div>
							</div>
						</form>
					) : (
						<form
							className={styles.form}
							onSubmit={handleContinue}
						>
							<div className={styles.formContent}>
								<div className={styles.formGroup}>
									<div className={styles.formLabel}>
										EMAIL ADDRESS
									</div>
									<input
										ref={emailRef}
										disabled={isSigningUp}
										className={styles.passwordInput}
										placeholder="Enter your email address"
										type="email"
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
													width={24}
													height={24}
												/>
											)}
										</button>
									</div>
								</div>

								<div className={styles.passwordRequirements}>
									<div className={styles.requirement}>
										{CheckIcon(password.length >= MINIMUM_PASSWORD_LENGTH)}
										<div className={styles.text}>
											At least 8 characters
										</div>
									</div>
									<div className={styles.requirement}>
										{CheckIcon(containsLowercaseLetter(password) && containsUppercaseLetter(password))}
										<div className={styles.text}>
											Includes a lowercase letter and an uppercase letter
										</div>
									</div>
									<div className={styles.requirement}>
										{CheckIcon(containsNumber(password))}
										<div className={styles.text}>
											Includes a number
										</div>
									</div>
								</div>
							</div>

							<div className={styles.authFooter}>
								<div className={styles.submitContainer}>
									<button
										className={styles.submitButton}
										type="submit"
										disabled={!email || !password || !validatePassword(password)}
									>
										Continue
									</button>
								</div>

								<Link
									href="/login"
									className={styles.link}
								>
									Already have an account? Log in instead.
								</Link>
							</div>
						</form>
					)
				}
			</div>
		</>
	)
}

