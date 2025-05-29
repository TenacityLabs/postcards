import { Postcard } from "../postcard";

export interface GetPostcardRequest {
	postcardId: string
}

export interface GetPostcardResponse {
	postcard: Postcard
}

export interface CreatePostcardResponse {
	postcards: Postcard[]
}

export interface DeletePostcardRequest {
	postcardId: string
}

export interface DeletePostcardResponse {
	postcards: Postcard[]
}

export interface CreateEntryRequest {
	postcardId: string
}

export interface CreateEntryResponse {
	postcard: Postcard
}

export interface DeleteEntryRequest {
	postcardId: string
	entryId: string
}

export interface DeleteEntryResponse {
	postcard: Postcard
}

export interface EditEntryRequest {
	postcardId: string
	entryId: string
	title: string
	description: string
	file: File | string | null
	date: string | null
}

export interface EditEntryResponse {
	postcard: Postcard
}
