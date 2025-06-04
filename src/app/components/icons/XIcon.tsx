import { IconProps } from "@/types/icons"

export const XIcon = (props: IconProps) => {
	const { width, height } = props

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M57 7L7 57M7 7L57 57" stroke="currentColor" strokeWidth="8.33333" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}