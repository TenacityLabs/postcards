import { MONTHS } from "@/constants/date"
import { Postcard } from "@/types/postcard"
import Link from "next/link"
import { useMemo } from "react"

interface FolderProps {
	postcard: Postcard
}

export default function Folder(props: FolderProps) {
	const { postcard } = props

	const dateString = useMemo(() => {
		const dateObject = new Date(postcard.createdAt)
		const date = dateObject.getDate()
		const month = dateObject.getMonth()
		const year = dateObject.getFullYear()
		return `${MONTHS.TitleCase[month]} ${date}, ${year}`
	}, [postcard.createdAt])

	return (
		<div>
			<Link href={`/postcard/${postcard._id}/edit`}>
				{dateString}
			</Link>
		</div>
	)
}