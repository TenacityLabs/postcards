"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { ClientLogger } from "@/utils/clientLogger";
import { showToast } from "../../ui/CustomToast";
import { AxiosError } from "axios";
import { Status } from "../../ui/StatusIndicator";
import { sendAPIRequest } from "@/utils/api";
import { APIEndpoints, APIMethods } from "@/types/api";
import { useUser } from "@/app/context/userContext";
import { LOCALSTORAGE_JWT_KEY } from "@/constants/auth";
import LoginDesktop from "./desktop";

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
			<LoginDesktop
				email={email}
				password={password}
				setPassword={setPassword}
				isLoggingIn={isLoggingIn}
				handleSubmit={handleSubmit}
				isPasswordVisible={isPasswordVisible}
				setIsPasswordVisible={setIsPasswordVisible}
				navigateToLanding={navigateToLanding}
			/>
		</>
	);
}

