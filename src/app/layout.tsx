import type { Metadata } from "next";
import "./globals.scss";
import { UserProvider } from "@/app/context/userContext";
import AuthRouter from "@/app/components/AuthRouter";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "Postcards",
	description: "Write postcards to your friends and family to stay in touch.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<UserProvider>
					<AuthRouter>
						{children}
					</AuthRouter>
				</UserProvider>

				<Toaster
					position="bottom-right"
				/>
			</body>
		</html>
	);
}
