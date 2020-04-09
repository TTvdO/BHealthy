import { useState, useEffect, useCallback } from "react";

import authService from "../components/api-authorization/AuthorizeService";

const getAuthorizationHeaders = token => {
	return token
		? {
				Authorization: `Bearer ${token}`
		  }
		: {};
};

const fetchWithAuth = async (input, init = { headers: {} }) => {
	const token = await authService.getAccessToken();

	const initWithAuthHeaders = {
		...init,
		headers: { ...init.headers, ...getAuthorizationHeaders(token) }
	};

	return await fetch(input, initWithAuthHeaders);
};

const fetchJsonWithAuth = async (input, init) => {
	const response = await fetchWithAuth(input, init);

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
