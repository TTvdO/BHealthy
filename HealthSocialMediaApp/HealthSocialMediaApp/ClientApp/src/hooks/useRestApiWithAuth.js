import { useState, useEffect, useCallback } from "react";

import authService from "../components/api-authorization/AuthorizeService";

const getAuthorizationHeaders = token => {
	return token
		? {
				Authorization: `Bearer ${token}`
		  }
		: {};
};

const fetchWithAuth = async (requestInfo, requestInit = { headers: {} }) => {
	const token = await authService.getAccessToken();

	const requestInitWithAuthHeaders = {
		...requestInit,
		headers: { ...requestInit.headers, ...getAuthorizationHeaders(token) }
	};

	return await fetch(requestInfo, requestInitWithAuthHeaders);
};

const fetchJsonWithAuth = async (requestInfo, requestInit) => {
	const response = await fetchWithAuth(requestInfo, requestInit);

	return await response.json();
};

/**
 * Use this for getting user data only
 * @param {*} userId the user to get data from
 */
const useRestApiWithAuth = (url, initialData) => {
	const [data, setData] = useState(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);

		try {
			const data = await fetchJsonWithAuth(url);
			setData(data);
		} catch (e) {
			setError(e);
		} finally {
			setIsLoading(false);
		}
	}, [url]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return [{ data, isLoading, error }, fetchData];
};

export { useRestApiWithAuth, fetchWithAuth, fetchJsonWithAuth };
