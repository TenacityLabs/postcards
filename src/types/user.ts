import { Postcard } from "./postcard";

export interface User {
	_id: string
	email: string
	postcards: Postcard[]
	createdAt: number
}