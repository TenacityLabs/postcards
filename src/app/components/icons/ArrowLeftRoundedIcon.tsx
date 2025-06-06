import { IconProps } from "@/types/icons";

export default function ArrowLeftRoundedIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M59 32H5M5 32L32 5M5 32L32 59" stroke="currentColor" strokeWidth="7.71428" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
