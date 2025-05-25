"use client"

import { LOCALSTORAGE_JWT_KEY } from '@/app/constants/auth'
import { User } from '@/types/user'
import { ClientLogger } from '@/utils/clientLogger'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface UserContextType {
	user: User | null
	loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem(LOCALSTORAGE_JWT_KEY)
				if (!token) {
					setLoading(false)
					setUser(null)
					return
				}

				const response = await fetch('/api/user', {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				if (!response.ok) {
					if (response.status === 401) {
						// Token expired or invalid
						localStorage.removeItem('token')
						setUser(null)
					}
					throw new Error('Failed to fetch user')
				}

				const data = await response.json()
				setUser(data.user)
				ClientLogger.sensitive(`User fetched: ${data.user.email}`)
			} catch (err) {
				ClientLogger.error(`Error fetching user: ${err}`)
			} finally {
				setLoading(false)
			}
		}

		fetchUser()
	}, [])

	return (
		<UserContext.Provider
			value={{
				user,
				loading
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export function useUser() {
	const context = useContext(UserContext)
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider')
	}
	return context
}
