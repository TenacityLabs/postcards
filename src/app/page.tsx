"use client"

import Link from "next/link";

export default function Home() {

	return (
		<div>
			<h1>Postcards</h1>
			<div>
				<Link href="/login">Login</Link>
			</div>
			<div>
				<Link href="/signup">Signup</Link>
			</div>
		</div>
	);
}
