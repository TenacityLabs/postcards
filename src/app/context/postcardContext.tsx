"use client"

import { APIEndpoints, APIMethods } from '@/types/api'
import { Entry, Postcard, PostcardDate } from '@/types/postcard'
import { sendAPIRequest } from '@/utils/api'
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
				const response = await sendAPIRequest(
					APIEndpoints.GetPostcard,
					APIMethods.GET,
					{
						postcardId: postcardId as string,
					},
				)

				const postcard: Postcard = response.postcard
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
