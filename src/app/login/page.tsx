"use client"

import styles from "./styles.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClientLogger } from "@/utils/clientLogger";
import { showToast } from "@/app/components/ui/CustomToast";
import { AxiosError } from "axios";
import { Status } from "../components/ui/StatusIndicator";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";
import { useUser } from "@/app/context/userContext";
import { LOCALSTORAGE_JWT_KEY } from "@/constants/auth";
import LoginMobile from "./mobile";
import LoginDesktop from "./desktop";
import { useScreenSize } from "@/app/hooks/useScreenSize";

export default function Login() {
	const { setUser } = useUser()
	const { screenWidth } = useScreenSize()
	const [email, setEmail] = useState("");
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
		<div className={styles.page}>
			{screenWidth > 1000 ? (
				<LoginDesktop
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
					isLoggingIn={isLoggingIn}
					handleSubmit={handleSubmit}
					isPasswordVisible={isPasswordVisible}
					setIsPasswordVisible={setIsPasswordVisible}
				/>
			) : (
				<LoginMobile
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
					isLoggingIn={isLoggingIn}
					handleSubmit={handleSubmit}
					isPasswordVisible={isPasswordVisible}
					setIsPasswordVisible={setIsPasswordVisible}
				/>
			)}
		</div>
	);
}

