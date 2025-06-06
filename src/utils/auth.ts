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

export const validatePassword = (password: string) => {
	// At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	return passwordRegex.test(password);
}