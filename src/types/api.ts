import { GetUserResponse, LoginRequest, LoginResponse, SignupRequest, SignupResponse, UserExistsResponse, UserExistsRequest } from "./api/auth"
import { CreateEntryRequest, CreateEntryResponse, CreatePostcardResponse, DeleteEntryImageRequest, DeleteEntryImageResponse, DeleteEntryRequest, DeleteEntryResponse, DeletePostcardRequest, DeletePostcardResponse, EditEntryRequest, EditEntryResponse, GetPostcardRequest, GetPostcardResponse, UploadEntryImageResponse, UploadEntryImageRequest } from "./api/postcard"

export enum APIMethods {
	GET = 'GET',
	POST = 'POST',
}

export enum APIEndpoints {
	// Auth
	Login = '/api/auth/login',
	Signup = '/api/auth/signup',
	UserExists = '/api/auth/user-exists',
	GetUser = '/api/user',

	// Postcard
	GetPostcard = '/api/postcard',
	CreatePostcard = '/api/postcard/create',
	DeletePostcard = '/api/postcard/delete',

	// Entry
	CreateEntry = '/api/postcard/entry/create',
	DeleteEntry = '/api/postcard/entry/delete',
	EditEntry = '/api/postcard/entry/edit',
	UploadEntryImage = '/api/postcard/entry/image/upload',
	DeleteEntryImage = '/api/postcard/entry/image/delete',
}

interface ApiDataDefinition<
	Method extends APIMethods,
	APIRequest = unknown | undefined,
	APIResponse = unknown | undefined,
> {
	method: Method
	request: APIRequest
	response: APIResponse
}

export interface ErrorResponse {
	error: string
}

export interface ApiDataDefinitions {
	[APIEndpoints.Login]: ApiDataDefinition<APIMethods.POST, LoginRequest, LoginResponse>
	[APIEndpoints.Signup]: ApiDataDefinition<APIMethods.POST, SignupRequest, SignupResponse>
	[APIEndpoints.GetUser]: ApiDataDefinition<APIMethods.GET, undefined, GetUserResponse>
	[APIEndpoints.UserExists]: ApiDataDefinition<APIMethods.POST, UserExistsRequest, UserExistsResponse>

	[APIEndpoints.GetPostcard]: ApiDataDefinition<APIMethods.GET, GetPostcardRequest, GetPostcardResponse>
	[APIEndpoints.CreatePostcard]: ApiDataDefinition<APIMethods.POST, undefined, CreatePostcardResponse>
	[APIEndpoints.DeletePostcard]: ApiDataDefinition<APIMethods.POST, DeletePostcardRequest, DeletePostcardResponse>

	[APIEndpoints.CreateEntry]: ApiDataDefinition<APIMethods.POST, CreateEntryRequest, CreateEntryResponse>
	[APIEndpoints.DeleteEntry]: ApiDataDefinition<APIMethods.POST, DeleteEntryRequest, DeleteEntryResponse>
	[APIEndpoints.EditEntry]: ApiDataDefinition<APIMethods.POST, EditEntryRequest, EditEntryResponse>
	[APIEndpoints.UploadEntryImage]: ApiDataDefinition<APIMethods.POST, UploadEntryImageRequest, UploadEntryImageResponse>
	[APIEndpoints.DeleteEntryImage]: ApiDataDefinition<APIMethods.POST, DeleteEntryImageRequest, DeleteEntryImageResponse>
}

export type APIRequest<T extends APIEndpoints> = ApiDataDefinitions[T]['request'];
export type APIResponse<T extends APIEndpoints> = ApiDataDefinitions[T]['response'];
export type APIMethod<T extends APIEndpoints> = ApiDataDefinitions[T]['method'];

export type RawObject = Record<string, string | number | boolean | File | null | undefined>;
