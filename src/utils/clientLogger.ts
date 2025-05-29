import { AxiosError } from "axios"

enum LogLevel {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
	DEBUG = 'DEBUG',
	SENSITIVE = 'SENSITIVE',
}

export class ClientLogger {
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
		const timestamp = ClientLogger.getTimestamp()
		console.log(`${timestamp} [${level}] ${message}`)
	}

	public static info(message: string) {
		ClientLogger.log(LogLevel.INFO, message)
	}

	public static warn(message: string) {
		ClientLogger.log(LogLevel.WARN, message)
	}

	public static error(error: unknown) {
		console.error(error)
		if (error instanceof AxiosError) {
			ClientLogger.log(LogLevel.ERROR, error.response?.data.message)
		} else if (error instanceof Error) {
			ClientLogger.log(LogLevel.ERROR, error.message)
		} else {
			ClientLogger.log(LogLevel.ERROR, JSON.stringify(error))
		}
	}

	public static debug(message: string) {
		ClientLogger.log(LogLevel.DEBUG, message)
	}

	public static sensitive(message: string) {
		ClientLogger.log(LogLevel.SENSITIVE, message)
	}
}
