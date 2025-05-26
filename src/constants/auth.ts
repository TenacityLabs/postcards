export const LOCALSTORAGE_JWT_KEY = 'postcard-jwt'

export const PROTECTED_ROUTES: Record<string, string | undefined> = {
	'/dashboard': '/',
}

export const PUBLIC_ROUTES: Record<string, string | undefined> = {
	'/': '/dashboard',
	'/login': '/dashboard',
	'/signup': '/dashboard',
}