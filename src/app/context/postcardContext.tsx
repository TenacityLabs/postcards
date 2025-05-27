"use client"

import { Entry, Postcard } from '@/types/postcard'
import { getAuthHeader } from '@/utils/api'
import { ClientLogger } from '@/utils/clientLogger'
import { useParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react'

interface PostcardContextType {
	postcard: Postcard | null
	setPostcard: Dispatch<SetStateAction<Postcard | null>>
	focusedEntry: Entry | null
	setFocusedEntry: Dispatch<SetStateAction<Entry | null>>
	loading: boolean
}

const PostcardContext = createContext<PostcardContextType | undefined>(undefined)

export function PostcardProvider({ children }: { children: ReactNode }) {
	const { postcardId } = useParams()
	const [postcard, setPostcard] = useState<Postcard | null>(null)
	const [loading, setLoading] = useState(true)
	const [focusedEntry, setFocusedEntry] = useState<Entry | null>(null)

	useEffect(() => {
		const fetchPostcard = async () => {
			if (!postcardId) {
				return
			}

			try {
				const param = {
					postcardId: postcardId as string,
				}
				const query = new URLSearchParams(param).toString()
				const response = await fetch(`/api/postcard?${query}`, {
					method: 'GET',
					headers: getAuthHeader(),
				})
				const data = await response.json()
				ClientLogger.info(`Postcard fetched: ${JSON.stringify(data)}`)
				setPostcard(data.postcard)
				if (data.postcard.entries.length > 0) {
					setFocusedEntry(data.postcard.entries[0])
				} else {
					setFocusedEntry(null)
				}
			} catch (error) {
				ClientLogger.error(`Error fetching postcard: ${error}`)
			} finally {
				setLoading(false)
			}
		}

		fetchPostcard()
	}, [postcardId])

	return (
		<PostcardContext.Provider
			value={{
				postcard,
				setPostcard,
				focusedEntry,
				setFocusedEntry,
				loading,
			}}
		>
			{children}
		</PostcardContext.Provider>
	)
}

export function usePostcard() {
	const context = useContext(PostcardContext)
	if (context === undefined) {
		throw new Error('usePostcard must be used within a PostcardProvider')
	}
	return context
}
