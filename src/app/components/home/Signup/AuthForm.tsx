"use client"

import { useEffect, useRef, useState } from "react";
import styles from "../styles.module.scss";
import EyeSlashIcon from "../../icons/EyeSlashIcon";
import EyeIcon from "../../icons/EyeIcon";
import CircleCheckIcon from "../../icons/CircleCheckIcon";
import CircleXIcon from "../../icons/CircleXIcon";
import { containsLowercaseLetter, containsNumber, containsUppercaseLetter, MINIMUM_PASSWORD_LENGTH, validatePassword } from "@/utils/auth";

const CheckIcon = (isChecked: boolean) => {
	if (isChecked) {
		return (
			<div className={styles.iconChecked}>
				<CircleCheckIcon width={28} height={28} />
			</div>
		)
	} else {
		return (
			<div className={styles.iconUnchecked}>
				<CircleXIcon width={28} height={28} />
			</div>
		)
	}
}

interface AuthFormProps {
	handleContinue: (e: React.FormEvent<HTMLFormElement>) => void
	loading: boolean
	email: string
	setEmail: (email: string) => void
	password: string
	setPassword: (password: string) => void
}

export default function AuthForm(props: AuthFormProps) {
	const { handleContinue, loading, email, setEmail, password, setPassword } = props;

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (passwordRef.current) {
			passwordRef.current.focus()
		}
	}, [])

	return (
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
						disabled={loading}
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
							ref={passwordRef}
							disabled={loading}
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

			<button
				className={styles.submitButton}
				type="submit"
				disabled={!email || !password || !validatePassword(password)}
			>
				Continue
			</button>
		</form>
	)
}