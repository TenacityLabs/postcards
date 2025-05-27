"use client"

export default function PostcardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// context provider here
	return (
		<>
			{children}
		</>
	);
}