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

interface LoginProps {
	email: string
	navigateToLanding: () => void
}

export default function Login(props: LoginProps) {
	const { email, navigateToLanding } = props
	const { setUser } = useUser()
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (passwordRef.current) {
			passwordRef.current.focus()
		}
	}, [])

	const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isLoggingIn) return
		try {
			setIsLoggingIn(true)

			const response = await sendAPIRequest(APIEndpoints.Login, APIMethods.POST, {
				email: email.trim(),
				password: password.trim()
			})
			localStorage.setItem(LOCALSTORAGE_JWT_KEY, response.token)
			setUser(response.user)
			showToast("Login successful", Status.Success)
		} catch (error) {
			setIsLoggingIn(false)
			ClientLogger.error(error)
			if (error instanceof AxiosError) {
				if (error.response?.data?.error) {
					showToast(error.response.data.error, Status.Error)
					return
				}
			}
			showToast("An error occurred while logging in", Status.Error)
		}
	}, [email, isLoggingIn, password, setUser])

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
	);
}

