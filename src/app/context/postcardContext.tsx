"use client"

import { Entry, Postcard, PostcardDate } from '@/types/postcard'
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
				const postcard: Postcard = data.postcard
				postcard.entries.forEach(entry => {
					entry.date = entry.date ? new PostcardDate(entry.date as unknown as string) : null
				})
				setPostcard(postcard)
				if (postcard.entries.length > 0) {
					setFocusedEntry(postcard.entries[0])
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

	useEffect(() => {
		if (!postcard || !focusedEntry) {
			return
		}

		const entryIndex = postcard.entries.findIndex(entry => entry._id === focusedEntry._id)
		if (entryIndex === -1) {
			setFocusedEntry(null)
		}
	}, [postcard, focusedEntry])

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
