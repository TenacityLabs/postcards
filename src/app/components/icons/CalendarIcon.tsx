
import { IconProps } from "@/types/icons";

export default function CalendarIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M24 12V20M40 12V20M14 28H50M24 36H24.02M32 36H32.02M40 36H40.02M24 44H24.02M32 44H32.02M40 44H40.02M18 16H46C48.2091 16 50 17.7909 50 20V48C50 50.2091 48.2091 52 46 52H18C15.7909 52 14 50.2091 14 48V20C14 17.7909 15.7909 16 18 16Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
