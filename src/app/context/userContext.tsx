"use client"

import { LOCALSTORAGE_JWT_KEY } from '@/constants/auth'
import { APIEndpoints, APIMethods } from '@/types/api'
import { User } from '@/types/user'
import { sendAPIRequest } from '@/utils/api'
import { ClientLogger } from '@/utils/clientLogger'
import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction, useCallback } from 'react'

interface UserContextType {
	user: User | null
	setUser: Dispatch<SetStateAction<User | null>>
	loading: boolean
	logout: () => void
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

				const response = await sendAPIRequest(
					APIEndpoints.GetUser,
					APIMethods.GET,
					undefined
				)

				setUser(response.user)
			} catch (err) {
				// Token expired or invalid
				localStorage.removeItem('token')
				setUser(null)
				ClientLogger.error(`Error fetching user: ${err}`)
			} finally {
				setLoading(false)
			}
		}

		fetchUser()
	}, [])

	const logout = useCallback(() => {
		localStorage.removeItem(LOCALSTORAGE_JWT_KEY)
		setUser(null)
	}, [setUser])

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				loading,
				logout,
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
