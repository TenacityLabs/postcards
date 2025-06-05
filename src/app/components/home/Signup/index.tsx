"use client"

import { useState } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";

interface SignupProps {
	email: string
	navigateToLanding: () => void
}

export default function Signup(props: SignupProps) {
	const { email, navigateToLanding } = props
	const [password, setPassword] = useState("");

	return (
		<>
			Signup
		</>
	);
}

