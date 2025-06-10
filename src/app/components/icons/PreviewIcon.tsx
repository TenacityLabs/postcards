import { IconProps } from "@/types/icons";

export default function PreviewIcon(props: IconProps) {
	const { width, height } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M5.91261 32.9148C5.69384 32.3255 5.69384 31.6772 5.91261 31.0878C8.04332 25.9214 11.6601 21.504 16.3044 18.3957C20.9487 15.2873 26.4114 13.6279 31.9999 13.6279C37.5884 13.6279 43.051 15.2873 47.6953 18.3957C52.3396 21.504 55.9564 25.9214 58.0871 31.0878C58.3059 31.6772 58.3059 32.3255 58.0871 32.9148C55.9564 38.0812 52.3396 42.4986 47.6953 45.607C43.051 48.7153 37.5884 50.3747 31.9999 50.3747C26.4114 50.3747 20.9487 48.7153 16.3044 45.607C11.6601 42.4986 8.04332 38.0812 5.91261 32.9148Z" stroke="currentColor" strokeWidth="5.25" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M32 39.875C36.3492 39.875 39.875 36.3492 39.875 32C39.875 27.6508 36.3492 24.125 32 24.125C27.6508 24.125 24.125 27.6508 24.125 32C24.125 36.3492 27.6508 39.875 32 39.875Z" stroke="currentColor" strokeWidth="5.25" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
