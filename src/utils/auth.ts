import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
	userId: string
	iat: number
	exp: number
}

export const verifyToken = (token: string): JWTPayload => {
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
