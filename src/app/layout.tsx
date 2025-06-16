import type { Metadata } from "next";
import "./globals.scss";
import { UserProvider } from "@/app/context/userContext";
import AuthRouter from "@/app/components/AuthRouter";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./context/modalContext";

export const metadata: Metadata = {
	title: "Postcards",
	description: "Write postcards to your friends and family to stay in touch.",
	openGraph: {
		title: "Postcards",
		description: "Write postcards to your friends and family to stay in touch.",
		images: [
			{
				url: "/images/metadata/postcards-og.jpg",
				width: 1200,
				height: 630,
				alt: "Postcards - Send love, one update at a time.",
			},
		],
		type: "website",
	},
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
					<ModalProvider>
						<AuthRouter>
							{children}
						</AuthRouter>
					</ModalProvider>
				</UserProvider>

				<Toaster
					position="bottom-right"
				/>
			</body>
		</html>
	);
}
