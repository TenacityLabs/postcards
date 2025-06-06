import { IconProps } from "@/types/icons";

export default function CircleCheckIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M23.9999 31.9997L29.3333 37.333L39.9999 26.6663M58.6666 31.9997C58.6666 46.7273 46.7275 58.6663 31.9999 58.6663C17.2723 58.6663 5.33325 46.7273 5.33325 31.9997C5.33325 17.2721 17.2723 5.33301 31.9999 5.33301C46.7275 5.33301 58.6666 17.2721 58.6666 31.9997Z" stroke="currentColor" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round" />
		</svg>

	)
}


