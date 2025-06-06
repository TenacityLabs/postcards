import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
	userId: string
	iat: number
	exp: number
}

export const verifyToken = (token: string | null | undefined): JWTPayload => {
	if (!token) {
		throw new Error('No token provided')
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
		return decoded
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Token verification failed: ${error.message}`)
		}
		throw new Error('Token verification failed')
	}
}

export const verifyRequest = (request: Request) => {
	const authHeader = request.headers.get('Authorization')
	if (!authHeader?.startsWith('Bearer ')) {
		throw new Error('No token provided')
	}

	const token = authHeader.split(' ')[1]
	return verifyToken(token)
}

export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export const MINIMUM_PASSWORD_LENGTH = 8;

export const containsLowercaseLetter = (password: string) => {
	return password.match(/[a-z]/g) !== null;
}

export const containsUppercaseLetter = (password: string) => {
	return password.match(/[A-Z]/g) !== null;
}

export const containsNumber = (password: string) => {
	return password.match(/[0-9]/g) !== null;
}

export const validatePassword = (password: string) => {
	return password.length >= MINIMUM_PASSWORD_LENGTH &&
		containsLowercaseLetter(password) &&
		containsUppercaseLetter(password) &&
		containsNumber(password);
}