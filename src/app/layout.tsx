import type { Metadata } from "next";

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
				{children}
			</body>
		</html>
	);
}
