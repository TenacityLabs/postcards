"use client"

import { useEffect, useRef } from "react";
import styles from "../styles.module.scss";

interface InfoFormProps {
	backToAuth: () => void
	handleSignup: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
	loading: boolean
	firstName: string
	setFirstName: (firstName: string) => void
	lastName: string
	setLastName: (lastName: string) => void
	displayName: string
	setDisplayName: (displayName: string) => void
}

export default function InfoForm(props: InfoFormProps) {
	const { backToAuth, handleSignup, loading, firstName, setFirstName, lastName, setLastName, displayName, setDisplayName } = props;
	const firstNameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (firstNameRef.current) {
			firstNameRef.current.focus();
		}
	}, []);

	return (
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
						disabled={loading}
						className={styles.formInput}
						placeholder="Who's writing?"
						value={firstName}
						type="text"
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>

				<div className={styles.formGroup}>
					<div className={styles.formLabel}>
						LAST NAME
					</div>
					<input
						disabled={loading}
						className={styles.formInput}
						placeholder="A little more specific please..."
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
						disabled={loading}
						className={styles.formInput}
						placeholder="Not too edgy please"
						type="text"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
				</div>
			</div>

			<div className={styles.submitContainer}>
				<button
					className={styles.backButton}
					type="button"
					onClick={backToAuth}
				>
					Back
				</button>

				<button
					className={styles.submitButton}
					type="submit"
					disabled={loading || !firstName || !lastName || !displayName}
				>
					Sign up
				</button>
			</div>
		</form>
	)
}