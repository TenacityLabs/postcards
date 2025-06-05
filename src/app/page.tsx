"use client"

import { useMemo, useState } from "react";
import styles from "./page.module.scss";
import Landing from "./components/home/Landing";

enum AuthPage {
	Landing = 'landing',
	Signup = 'signup',
	Login = 'login',
}

export default function Home() {
	const [authPage, setAuthPage] = useState<AuthPage>(AuthPage.Landing);

	const renderedPage = useMemo(() => {
		switch (authPage) {
			case AuthPage.Login:
				return <>Login</>
			case AuthPage.Signup:
				return <>Signup</>
			case AuthPage.Landing:
				return (
					<Landing
						navigateToLogin={() => setAuthPage(AuthPage.Login)}
						navigateToSignup={() => setAuthPage(AuthPage.Signup)}
					/>
				)
		}
	}, [authPage])

	return (
		<div className={styles.page}>
			{renderedPage}
		</div>
	);
}
