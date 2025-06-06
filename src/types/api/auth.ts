import { User } from "../user"

export interface LoginRequest {
	email: string
	password: string
}

export interface LoginResponse {
	user: User
	token: string,
}

export interface SignupRequest {
	email: string
	password: string
	firstName: string
	lastName: string
	displayName: string
}

export interface SignupResponse {
	user: User
	token: string,
}

export interface GetUserResponse {
	user: User
}

export interface UserExistsRequest {
	email: string
}

export interface UserExistsResponse {
	exists: boolean
}
