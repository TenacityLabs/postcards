import { Postcard } from "./postcard";

export interface User {
	_id: string
	email: string
	firstName: string
	lastName: string
	displayName: string
	postcards: Postcard[]
	createdAt: number
}

export interface PrivateUser {
	firstName: string
	lastName: string
}