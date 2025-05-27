"use client"

import { PostcardProvider } from "@/app/context/postcardContext";

export default function PostcardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<PostcardProvider>
			{children}
		</PostcardProvider>
	);
}