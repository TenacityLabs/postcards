import axios from "axios"
import { GetUserResponse, LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "./api/auth"
import { CreateEntryRequest, CreateEntryResponse, CreatePostcardResponse, DeleteEntryRequest, DeleteEntryResponse, DeletePostcardRequest, DeletePostcardResponse, EditEntryRequest, EditEntryResponse, GetPostcardResponse } from "./api/postcard"

export enum APIMethods {
	GET = 'GET',
	POST = 'POST',
}

export enum APIEndpoints {
	// Auth
	Login = '/api/auth/login',
	Signup = '/api/auth/signup',
	GetUser = '/api/user',

	// Postcard
	GetPostcard = '/api/postcard',
	CreatePostcard = '/api/postcard/create',
	DeletePostcard = '/api/postcard/delete',

	// Entry
	CreateEntry = '/api/entry/create',
	DeleteEntry = '/api/entry/delete',
	EditEntry = '/api/entry/edit',
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

interface ErrorResponse {
	message: string
}

export interface ApiDataDefinitions {
	[APIEndpoints.Login]: ApiDataDefinition<APIMethods.POST, LoginRequest, LoginResponse>
	[APIEndpoints.Signup]: ApiDataDefinition<APIMethods.POST, SignupRequest, SignupResponse>
	[APIEndpoints.GetUser]: ApiDataDefinition<APIMethods.GET, undefined, GetUserResponse>

	[APIEndpoints.GetPostcard]: ApiDataDefinition<APIMethods.GET, undefined, GetPostcardResponse>
	[APIEndpoints.CreatePostcard]: ApiDataDefinition<APIMethods.POST, undefined, CreatePostcardResponse>
	[APIEndpoints.DeletePostcard]: ApiDataDefinition<APIMethods.POST, DeletePostcardRequest, DeletePostcardResponse>

	[APIEndpoints.CreateEntry]: ApiDataDefinition<APIMethods.POST, CreateEntryRequest, CreateEntryResponse>
	[APIEndpoints.DeleteEntry]: ApiDataDefinition<APIMethods.POST, DeleteEntryRequest, DeleteEntryResponse>
	[APIEndpoints.EditEntry]: ApiDataDefinition<APIMethods.POST, EditEntryRequest, EditEntryResponse>
}

export type APIRequest<T extends APIEndpoints> = ApiDataDefinitions[T]['request'];
export type APIResponse<T extends APIEndpoints> = ApiDataDefinitions[T]['response'] | ErrorResponse;
export type APIMethod<T extends APIEndpoints> = ApiDataDefinitions[T]['method'];

type RawObject = Record<string, string | number | boolean | File | null | undefined>;

const objectToFormData = (obj: RawObject) => {
	const formData = new FormData();
	for (const key in obj) {
		if (obj[key] === null || obj[key] === undefined) {
			continue;
		}
		if (obj[key] instanceof File) {
			formData.append(key, obj[key]);
		} else {
			formData.append(key, obj[key].toString());
		}
	}
	return formData;
}

const FORM_DATA_ENDPOINTS = [APIEndpoints.EditEntry]

export const sendAPIRequest = async <T extends APIEndpoints>(endpoint: T, method: APIMethod<T>, request: APIRequest<T>): Promise<APIResponse<T>> => {
	const isFormDataEndpoint = FORM_DATA_ENDPOINTS.includes(endpoint);

	const response = await axios.request<APIResponse<T>>({
		method,
		url: endpoint,
		data: isFormDataEndpoint ? objectToFormData(request as unknown as RawObject) : request,
	})

	return response.data;
}
