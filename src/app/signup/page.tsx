"use client"

import styles from "./styles.module.scss";
import { useCallback, useState } from "react";
import { ClientLogger } from "@/utils/clientLogger";
import { showToast } from "@/app/components/ui/CustomToast";
import { AxiosError } from "axios";
import { Status } from "@/app/components/ui/StatusIndicator";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";
import { useUser } from "@/app/context/userContext";
import { LOCALSTORAGE_JWT_KEY } from "@/constants/auth";
import { validateEmail, validatePassword } from "@/utils/auth";
import { useScreenSize } from "@/app/hooks/useScreenSize";
import SignupDesktop from "./desktop";
import SignupMobile from "./mobile";

export default function Signup() {
	const { setUser } = useUser()
	const { screenWidth } = useScreenSize()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [isFillingSenderInfo, setIsFillingSenderInfo] = useState(false);
	const [isSigningUp, setIsSigningUp] = useState(false);

	const handleContinue = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isFillingSenderInfo) return
		if (!email || !password) {
			showToast("Please fill in all fields", Status.Error)
			return
		}
		if (!validateEmail(email)) {
			showToast("Please enter a valid email address", Status.Error)
			return
		}
		if (!validatePassword(password)) {
			showToast("Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character", Status.Error)
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
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				displayName: displayName.trim()
			})
			localStorage.setItem(LOCALSTORAGE_JWT_KEY, response.token)
			setUser(response.user)
			showToast("Signup successful", Status.Success)
		} catch (error) {
			setIsSigningUp(false)
			ClientLogger.error(error)
			if (error instanceof AxiosError) {
				if (error.response?.data?.error) {
					showToast(error.response.data.error, Status.Error)
					return
				}
			}
			showToast("An error occurred while signing up", Status.Error)
		}
	}, [email, isSigningUp, password, setUser, firstName, lastName, displayName])

	return (
		<div className={styles.page}>
			{screenWidth > 1000 ? (
				<SignupDesktop
					email={email}
					setEmail={setEmail}
					firstName={firstName}
					setFirstName={setFirstName}
					lastName={lastName}
					setLastName={setLastName}
					displayName={displayName}
					setDisplayName={setDisplayName}
					password={password}
					setPassword={setPassword}
					isPasswordVisible={isPasswordVisible}
					setIsPasswordVisible={setIsPasswordVisible}
					isSigningUp={isSigningUp}
					handleSignup={handleSignup}
					isFillingSenderInfo={isFillingSenderInfo}
					setIsFillingSenderInfo={setIsFillingSenderInfo}
					handleContinue={handleContinue}
				/>
			) : (
				<SignupMobile
					email={email}
					setEmail={setEmail}
					firstName={firstName}
					setFirstName={setFirstName}
					lastName={lastName}
					setLastName={setLastName}
					displayName={displayName}
					setDisplayName={setDisplayName}
					password={password}
					setPassword={setPassword}
					isPasswordVisible={isPasswordVisible}
					setIsPasswordVisible={setIsPasswordVisible}
					isSigningUp={isSigningUp}
					handleSignup={handleSignup}
					isFillingSenderInfo={isFillingSenderInfo}
					handleContinue={handleContinue}
					backToAuth={() => setIsFillingSenderInfo(false)}
				/>
			)}
		</div>
	);
}

