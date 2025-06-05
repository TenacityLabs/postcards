
import { IconProps } from "@/types/icons";

export default function CalendarIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M21.5 5V15.8M43.1 5V15.8M8 26.6H56.6M21.5 37.4H21.527M32.3 37.4H32.327M43.1 37.4H43.127M21.5 48.2H21.527M32.3 48.2H32.327M43.1 48.2H43.127M13.4 10.4H51.2C54.1823 10.4 56.6 12.8177 56.6 15.8V53.6C56.6 56.5823 54.1823 59 51.2 59H13.4C10.4177 59 8 56.5823 8 53.6V15.8C8 12.8177 10.4177 10.4 13.4 10.4Z" stroke="currentColor" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" />

		</svg>
	)
}
