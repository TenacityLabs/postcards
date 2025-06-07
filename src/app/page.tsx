"use client"

import { useMemo, useState } from "react";
import styles from "./page.module.scss";
import Landing from "./components/home/Landing";
import Signup from "./components/home/Signup";
import Login from "./components/home/Login";

enum AuthPage {
	Landing = 'landing',
	Signup = 'signup',
	Login = 'login',
}

export default function Home() {
	const [authPage, setAuthPage] = useState<AuthPage>(AuthPage.Landing);
	const [email, setEmail] = useState("");

	const renderedPage = useMemo(() => {
		switch (authPage) {
			case AuthPage.Login:
				return (
					<Login
						email={email}
						navigateToLanding={() => setAuthPage(AuthPage.Landing)}
						navigateToSignup={() => setAuthPage(AuthPage.Signup)}
					/>
				)
			case AuthPage.Signup:
				return (
					<Signup
						email={email}
						setEmail={setEmail}
						navigateToLanding={() => setAuthPage(AuthPage.Landing)}
						navigateToLogin={() => setAuthPage(AuthPage.Login)}
					/>
				)
			case AuthPage.Landing:
				return (
					<Landing
						email={email}
						setEmail={setEmail}
						navigateToLogin={() => setAuthPage(AuthPage.Login)}
						navigateToSignup={() => setAuthPage(AuthPage.Signup)}
					/>
				)
		}
	}, [authPage, email])

	return (
		<div className={`${styles.page} ${authPage === AuthPage.Landing ? styles.landing : ''}`}>
			{renderedPage}
		</div>
	);
}
