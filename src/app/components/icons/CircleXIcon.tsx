import { IconProps } from "@/types/icons";

export default function CircleXIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M40.1 23.9L23.9 40.1M23.9 23.9L40.1 40.1M59 32C59 46.9117 46.9117 59 32 59C17.0883 59 5 46.9117 5 32C5 17.0883 17.0883 5 32 5C46.9117 5 59 17.0883 59 32Z" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>

	)
}

