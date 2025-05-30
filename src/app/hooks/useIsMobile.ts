import { MOBILE_BREAKPOINT } from '@/constants/screen'
import { useEffect, useState } from 'react'

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		// Check if window is defined (client-side)
		if (typeof window === 'undefined') return

		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
		}

		// Initial check
		checkIsMobile()

		// Add event listener
		window.addEventListener('resize', checkIsMobile)

		// Cleanup
		return () => window.removeEventListener('resize', checkIsMobile)
	}, [])

	return isMobile
} 