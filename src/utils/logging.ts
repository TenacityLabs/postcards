enum LogLevel {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
	DEBUG = 'DEBUG',
	SENSITIVE = 'SENSITIVE',
}

export class Logger {
	constructor() { }

	private static getTimestamp(): string {
		const now = new Date()
		const year = now.getUTCFullYear()
		const month = String(now.getUTCMonth() + 1).padStart(2, '0')
		const day = String(now.getUTCDate()).padStart(2, '0')
		const hours = String(now.getUTCHours()).padStart(2, '0')
		const minutes = String(now.getUTCMinutes()).padStart(2, '0')
		const seconds = String(now.getUTCSeconds()).padStart(2, '0')

		return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`
	}

	private static log(level: LogLevel, message: string) {
		const timestamp = Logger.getTimestamp()
		console.log(`${timestamp} [${level}] ${message}`)
	}

	public static info(message: string) {
		Logger.log(LogLevel.INFO, message)
	}

	public static warn(message: string) {
		Logger.log(LogLevel.WARN, message)
	}

	public static error(message: string) {
		Logger.log(LogLevel.ERROR, message)
	}

	public static debug(message: string) {
		Logger.log(LogLevel.DEBUG, message)
	}

	public static sensitive(message: string) {
		Logger.log(LogLevel.SENSITIVE, message)
	}
}