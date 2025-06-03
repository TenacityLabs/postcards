"use client"

import { APIEndpoints, APIMethods } from '@/types/api'
import { Entry, Postcard, PostcardDate } from '@/types/postcard'
import { sendAPIRequest } from '@/utils/api'
import { ClientLogger } from '@/utils/clientLogger'
import { useParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction, useCallback, useMemo } from 'react'

interface PostcardContextType {
	postcard: Postcard | null
	setPostcard: Dispatch<SetStateAction<Postcard | null>>
	updatePostcard: (partialPostcard: Partial<Postcard>) => void
	updateEntry: (entryId: string, partialEntry: Partial<Entry>) => void
	focusedEntryId: string | null
	setFocusedEntryId: Dispatch<SetStateAction<string | null>>
	focusedEntry: Entry | null
	loading: boolean
}

const PostcardContext = createContext<PostcardContextType | undefined>(undefined)

export function PostcardProvider({ children }: { children: ReactNode }) {
	const { postcardId } = useParams()
	const [postcard, setPostcard] = useState<Postcard | null>(null)
	const [loading, setLoading] = useState(true)
	const [focusedEntryId, setFocusedEntryId] = useState<string | null>(null)
	const focusedEntry = useMemo(() => {
		if (!postcard) {
			return null
		}
		return postcard.entries.find(entry => entry._id === focusedEntryId) || null
	}, [postcard, focusedEntryId])

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
					setFocusedEntryId(postcard.entries[0]._id)
				} else {
					setFocusedEntryId(null)
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

		const entryIndex = postcard.entries.findIndex(entry => entry._id === focusedEntryId)
		if (entryIndex === -1) {
			setFocusedEntryId(null)
		}
	}, [postcard, focusedEntryId])

	const updatePostcard = useCallback((partialPostcard: Partial<Postcard>) => {
		setPostcard(prevPostcard => {
			if (!prevPostcard) {
				return null
			}
			return { ...prevPostcard, ...partialPostcard }
		})
	}, [])

	const updateEntry = useCallback((entryId: string, partialEntry: Partial<Entry>) => {
		setPostcard(prevPostcard => {
			if (!prevPostcard) {
				return null
			}
			const prevEntry = prevPostcard.entries.find(entry => entry._id === entryId)
			if (!prevEntry) {
				return prevPostcard
			}
			const newEntry = { ...prevEntry, ...partialEntry }
			return { ...prevPostcard, entries: prevPostcard.entries.map(entry => entry._id === entryId ? newEntry : entry) }
		})
	}, [])

	return (
		<PostcardContext.Provider
			value={{
				postcard,
				setPostcard,
				focusedEntryId,
				setFocusedEntryId,
				focusedEntry,
				updatePostcard,
				updateEntry,
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
