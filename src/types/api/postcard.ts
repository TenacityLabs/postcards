import { Entry, Postcard } from "../postcard";

export interface GetPostcardRequest {
	postcardId: string
}

export interface GetPostcardResponse {
	postcard: Postcard
}

export interface CreatePostcardResponse {
	postcardId: string
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
	entry: Entry
}

export interface DeleteEntryRequest {
	postcardId: string
	entryId: string
}

export interface DeleteEntryResponse {
	message: string
}

export interface EditEntryRequest {
	postcardId: string
	entryId: string
	title: string
	description: string
	date: string | null
}

export interface EditEntryResponse {
	title: string
	description: string
	date: string | null
}

export interface UploadEntryImageRequest {
	postcardId: string
	entryId: string
	image: File | null
	imageName: string | null
}

export interface UploadEntryImageResponse {
	imageUrl: string
	imageName: string
}

export interface DeleteEntryImageRequest {
	postcardId: string
	entryId: string
}

export interface DeleteEntryImageResponse {
	message: string
}
