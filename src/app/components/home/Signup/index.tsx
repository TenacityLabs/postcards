"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import ArrowLeftRoundedIcon from "@/app/components/icons/ArrowLeftRoundedIcon";
import { ClientLogger } from "@/utils/clientLogger";
import { showToast } from "../../ui/CustomToast";
import { AxiosError } from "axios";
import { Status } from "../../ui/StatusIndicator";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";
import { useUser } from "@/app/context/userContext";
import { LOCALSTORAGE_JWT_KEY } from "@/constants/auth";
import EyeIcon from "../../icons/EyeIcon";
import EyeSlashIcon from "../../icons/EyeSlashIcon";
import { validateEmail, validatePassword } from "@/utils/auth";
import CircleXIcon from "../../icons/CircleXIcon";

interface SignupProps {
	email: string
	setEmail: (email: string) => void
	navigateToLanding: () => void
}

export default function Signup(props: SignupProps) {
	const { email, setEmail, navigateToLanding } = props
	const { setUser } = useUser()
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isSigningUp, setIsSigningUp] = useState(false);
	const [isFillingSenderInfo, setIsFillingSenderInfo] = useState(false);
	const emailRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (emailRef.current) {
			emailRef.current.focus()
		}
	}, [])

	const handleContinue = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isFillingSenderInfo) return
		if (!email || !password) {
			showToast("Please fill in all fields", Status.ERROR)
			return
		}
		if (!validateEmail(email)) {
			showToast("Please enter a valid email address", Status.ERROR)
			return
		}
		if (!validatePassword(password)) {
			showToast("Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character", Status.ERROR)
			return
		}

		setIsFillingSenderInfo(true)
	}, [email, isFillingSenderInfo, password])

	const handleSignup = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isSigningUp) return
		try {
			setIsSigningUp(true)

			const response = await sendAPIRequest(APIEndpoints.Signup, APIMethods.POST, {
				email: email.trim(),
				password: password.trim(),
				firstName: "",
				lastName: "",
				displayName: ""
			})
			localStorage.setItem(LOCALSTORAGE_JWT_KEY, response.token)
			setUser(response.user)
			showToast("Signup successful", Status.SUCCESS)
		} catch (error) {
			setIsSigningUp(false)
			ClientLogger.error(error)
			if (error instanceof AxiosError) {
				if (error.response?.data?.error) {
					showToast(error.response.data.error, Status.ERROR)
					return
				}
			}
			showToast("An error occurred while signing up", Status.ERROR)
		}
	}, [email, isSigningUp, password, setUser])

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
							<h1>Sign up</h1>
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
									className={styles.formInput}
									placeholder="Enter your email address"
									value={email}
									type="email"
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
												width={28}
												height={28}
											/>
										)}
									</button>
								</div>
							</div>

							<div className={styles.passwordRequirements}>
								<div className={styles.passwordRequirement}>
									<CircleXIcon
										width={36}
										height={36}
									/>
									<span>At least 8 characters</span>
								</div>
							</div>
						</div>

						<button
							className={styles.submitButton}
							type="submit"
							disabled={!email || !password || !validatePassword(password)}
						>
							Continue
						</button>
					</form>
				</div>
			</div>
		</>
	);
}



