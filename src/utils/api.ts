import { LOCALSTORAGE_JWT_KEY } from "@/constants/auth"
import { APIEndpoints, APIMethod, APIMethods, APIRequest, APIResponse, RawObject } from "@/types/api"
import axios from "axios"

export const getAuthHeader = () => {
	const token = localStorage.getItem(LOCALSTORAGE_JWT_KEY)
	if (!token) {
		return {
			Authorization: '',
		}
	}

	return {
		Authorization: `Bearer ${token}`,
	}
}

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

const FORM_DATA_ENDPOINTS = [APIEndpoints.UploadEntryImage, APIEndpoints.DeleteEntryImage]

export const sendAPIRequest = async <T extends APIEndpoints>(endpoint: T, method: APIMethod<T>, request: APIRequest<T>): Promise<APIResponse<T>> => {
	const isFormDataEndpoint = FORM_DATA_ENDPOINTS.includes(endpoint);

	const response = await axios.request<APIResponse<T>>({
		method,
		url: endpoint,
		...(method === APIMethods.GET ?
			{ params: request } :
			{ data: isFormDataEndpoint ? objectToFormData(request as unknown as RawObject) : request }
		),
		headers: getAuthHeader(),
	})

	return response.data;
}