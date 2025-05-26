"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/app/context/userContext";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/auth";

interface AuthRouterProps {
	children: React.ReactNode
}

export default function AuthRouter(props: AuthRouterProps) {
	const { children } = props
	const pathname = usePathname()
	const router = useRouter()
	const { user, loading } = useUser()

	useEffect(() => {
		if (loading) {
			return
		}
		if (!user && PROTECTED_ROUTES[pathname]) {
			router.push(PROTECTED_ROUTES[pathname])
		}
		if (user && PUBLIC_ROUTES[pathname]) {
			router.push(PUBLIC_ROUTES[pathname])
		}
	}, [router, pathname, user, loading])

	return children
}
