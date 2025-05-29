import { LOCALSTORAGE_JWT_KEY } from "@/constants/auth"

export const getAuthHeader = () => {
	const token = localStorage.getItem(LOCALSTORAGE_JWT_KEY)

	return {
		Authorization: `Bearer ${token}`,
	}
}
