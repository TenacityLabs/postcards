import styles from "../styles.module.scss";
import Image from "next/image";
import ArrowLeftRoundedIcon from "@/app/components/icons/ArrowLeftRoundedIcon";
import InfoForm from "./InfoForm";
import AuthForm from "./AuthForm";

interface SignupDesktopProps {
	navigateToLanding: () => void
	email: string
	setEmail: (email: string) => void
	firstName: string
	setFirstName: (firstName: string) => void
	lastName: string
	setLastName: (lastName: string) => void
	displayName: string
	setDisplayName: (displayName: string) => void
	password: string
	setPassword: (password: string) => void
	isPasswordVisible: boolean
	setIsPasswordVisible: (isPasswordVisible: boolean) => void
	isSigningUp: boolean
	handleSignup: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
	isFillingSenderInfo: boolean
	setIsFillingSenderInfo: (isFillingSenderInfo: boolean) => void
	handleContinue: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function SignupDesktop(props: SignupDesktopProps) {
	const { navigateToLanding, email, setEmail, firstName, setFirstName, lastName, setLastName, displayName, setDisplayName, password, setPassword, isPasswordVisible, setIsPasswordVisible, isSigningUp, handleSignup, isFillingSenderInfo, setIsFillingSenderInfo, handleContinue } = props

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
							{isFillingSenderInfo ? (
								<h1>
									Sender information
								</h1>
							) : (
								<>
									<button
										onClick={navigateToLanding}
									>
										<ArrowLeftRoundedIcon width={20} height={20} />
									</button>
									<h1>
										Sign up
									</h1>
								</>
							)}
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

					{isFillingSenderInfo ? (
						<InfoForm
							backToAuth={() => setIsFillingSenderInfo(false)}
							handleSignup={handleSignup}
							loading={isSigningUp}
							firstName={firstName}
							setFirstName={setFirstName}
							lastName={lastName}
							setLastName={setLastName}
							displayName={displayName}
							setDisplayName={setDisplayName}
						/>
					) : (
						<AuthForm
							handleContinue={handleContinue}
							loading={isSigningUp}
							email={email}
							setEmail={setEmail}
							password={password}
							setPassword={setPassword}
							isPasswordVisible={isPasswordVisible}
							setIsPasswordVisible={setIsPasswordVisible}
						/>
					)}
				</div>
			</div>
		</>
	)
}