import { MOBILE_BREAKPOINT } from '@/constants/screen'
import { useEffect, useState } from 'react'

export function useScreenSize() {
	const [screenWidth, setScreenWidth] = useState(0)

	useEffect(() => {
		// Check if window is defined (client-side)
		if (typeof window === 'undefined') return

		const updateScreenWidth = () => {
			setScreenWidth(window.innerWidth)
		}

		// Initial check
		updateScreenWidth()

		// Add event listener
		window.addEventListener('resize', updateScreenWidth)

		// Cleanup
		return () => window.removeEventListener('resize', updateScreenWidth)
	}, [])

	return {
		isMobile: screenWidth < MOBILE_BREAKPOINT,
		screenWidth: screenWidth,
	}
} 
