export const clearTimeoutIfExists = (timeout: NodeJS.Timeout | null) => {
	if (timeout) {
		clearTimeout(timeout)
	}
}

export const clearIntervalIfExists = (interval: NodeJS.Timeout | null) => {
	if (interval) {
		clearInterval(interval)
	}
}
