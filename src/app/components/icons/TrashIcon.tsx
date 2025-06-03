import { IconProps } from "@/types/icons";

export default function TrashIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M8 13.332H56M50.6667 13.332V50.6654C50.6667 53.332 48 55.9987 45.3333 55.9987H18.6667C16 55.9987 13.3333 53.332 13.3333 50.6654V13.332M21.3333 13.3335L21.2376 11.9987C21.2376 9.33202 24 6.30957 26.6667 6.30957H37.3333C40 6.30957 42.6667 9.3335 42.6667 12.0002V13.3335M26.6667 26.6654V42.6654M37.3333 26.6654V42.6654" stroke="currentColor" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
		</svg>

	)
}

